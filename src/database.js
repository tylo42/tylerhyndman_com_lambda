'user strict';

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'})

exports.read = async (tableName, limit) => {
    console.log("Scanning dynamoDb table: metadata");

    let scanningParameters = {
        TableName: tableName,
        Limit: limit
    };
    
    return docClient.scan(scanningParameters).promise();
}