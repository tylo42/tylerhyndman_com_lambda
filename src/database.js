'user strict';

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-west-2'
});
const docClient = new AWS.DynamoDB.DocumentClient();

exports.read = async (tableName, limit) => {
    console.log(`Scanning dynamoDb table: ${tableName}`);

    let scanningParameters = {
        TableName: tableName,
        Limit: limit
    };
    
    return docClient.scan(scanningParameters).promise();
}