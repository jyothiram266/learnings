const express = require('express');
const client = require('prom-client');
const responsetTime = require("response-time")
const { doSomethingHeavyTask } = require('./heavyTask');
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");


const PORT = process.env.PORT || 8000;
const app = express();

const options = {
    transports: [
      new LokiTransport({
        labels :{
            appName : "express",
        },
        host: "http://127.0.0.1:3100"
      })
    ]
};

const logger = createLogger(options);
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register : client.register });

const reqResTime = new client.Histogram({
    name : "http_express_req_res_time" , 
    help  : "This tells how much time is taken by req and res",
    labelNames :["method" , "route" , "status_code"],
    buckets : [1,20,100,200,400,500,800,1000,2000],
});

const totalREqCounter = new client.Counter({
    name : "total_req",
    help : "Tells total req"
});


app.use(responsetTime((req,res,time)=>{
    totalREqCounter.inc();
    reqResTime
    .labels({
        method : req.method ,
        route : req.url,
        status_code : res.statusCode,
    })
    .observe(time);
}))

app.get("/" ,(req,res)=>{
    logger.info('Req Came on "/" route');
    return res.json({"mess" : "server running"})
})


app.get("/slow" , async(req,res)=>{
    try {
        const timetaken = await doSomethingHeavyTask();
        logger.info('Req Came on "/slow" route')
        return res.json({
            status: "message",
            message : `Heavy task completed In ${timetaken}ms`,
        }) 
    } catch (error) {
        logger.info(error.message);
        
        return res
        .status(500)
        .json({
            status : "Error" ,
            error : "Internal Server Error"
        })
    }
})


app.get("/metrics", async(req,res)=>{
    res.setHeader('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
})

app.listen(PORT,()=> console.log(`Express server Running on http://localhost:${PORT}`))