var AWS = require("aws-sdk")

const awsConfig = {
    "region": "us-east-1",
    "accessKeyId": "AKIAIM4ZM4MP3C4JV6RA",
    "secretAccessKey": "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"
};

AWS.config.update(awsConfig);

var s3 = new AWS.S3();

s3.listBuckets(function(err, data){
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Bucket List", data.Buckets);
    }
});



