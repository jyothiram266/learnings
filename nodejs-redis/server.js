const express = require('express');
const axios = require("axios");
const app = express();
const {client}  = require("./client")

app.get("/" , async (req,res) =>{
    const cachevalue = await client.get('todos');

    if(cachevalue) return res.json(JSON.parse(cachevalue));

    const {data} = await axios.get("https://jsonplaceholder.typicode.com/todos");
    await client.set('todos', JSON.stringify(data) );
    await client.expire('todos' , 30); 
    
    return res.json(data);
});


app.listen(3000, () => {
    console.log("Server created on port 3000");
});
