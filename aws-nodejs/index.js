const  { S3Client , GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    region : "ap-south-1",
    credentials : {
        accessKeyId : <YOUR-ACCESS-KEY>,
        secretAccessKey : <YOUR-SECREAT-ACCESS-KEY>,
    }
});


async function getObjectURL(key){
    const command = new GetObjectCommand({
        Bucket : <YOUR-BUCKET>,
        Key : key ,
    });
    const url = await getSignedUrl(s3Client,command);
    return url;
}

async function putObject(filename,contentType){
    const command = new PutObjectCommand({
        Bucket : <YOUR-BUCKET>,
        Key : `uplods/user-uploads/${filename}`,
        contentType : contentType,
    });
    const url = await getSignedUrl(s3Client,command);
    return url ;
}
    async function init (){
    //console.log('URL for pdf',await getObjectURL("PEM-ASSIGNMNET-JYOTHIRAM.pdf"))

    console.log('URL for pdf',await putObject(`image-${Date.now()}.jpeg`,"image/jpeg"));


}

init();