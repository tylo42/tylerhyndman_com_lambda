'user strict';

const config = require('./config.js');
const AWS = require('aws-sdk');

AWS.config.update(config.awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient();

exports.read = async (tableName, limit) => {
    console.log(`Scanning dynamoDb table: ${tableName}`);

    let scanningParameters = {
        TableName: tableName,
        Limit: limit
    };
    
    return docClient.scan(scanningParameters).promise();
}