var AWS = require("aws-sdk")

let awsConfig = {
    "region": "us-east-1",
    "endpoint": "https://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "AKIAIM4ZM4MP3C4JV6RA",
    "secretAccessKey": "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"
};

AWS.config.update(awsConfig);

function getDocClient(){
    return new AWS.DynamoDB.DocumentClient();
}


function fetchOneByKey() {
    var params = {
        TableName: "User",
        Key: {
            "email": "truonganhminh94@gmail.com"
        }
    };
    return docClient.get(params, function(err, data) {
        if(err) {
            console.log("user::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("user::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
        }
    });
};

function modify() {
    var params = {
        TableName: "User",
        Key: { "email": "truonganhminh94@gmail.com" },
        UpdateExpression: "set updated_by = :byUser, is_deleted = :boolValue",
        ExpressionAttributeValues: {
            ":byUser": "updateUser",
            ":boolValue": true
        },
        ReturnValues: "UPDATED_NEW"

    };
    docClient.update(params, function (err, data) {

        if (err) {
            console.log("user::update::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("user::update::success "+JSON.stringify(data) );
        }
    });
};

function save( input ) {

    var params = {
        TableName: "User",
        Item:  input
    };
    docClient.put(params, function (err, data) {

        if (err) {
            console.log("user::save::error - " + JSON.stringify(err, null, 2));                      
        } else {
            console.log("user::save::success" );                      
        }
    });
};

function remove() {

    var params = { 
        TableName: "User",
        Key: {
            "email": "truonganhminh94@gmail.com"
        }
    };
    docClient.delete(params, function (err, data) {

        if (err) {
            console.log("user::delete::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("user::delete::success");
        }
    });
};

module.exports = {
    fetchOneByKey,
    modify,
    save, 
    remove,
    getDocClient
};