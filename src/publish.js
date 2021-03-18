'use strict';

const AWS = require('aws-sdk');
const config = require('./config.js');

exports.publish = async (body) => {
    const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

    const params = {
       DelaySeconds: 0,
       MessageAttributes: {},
       MessageBody: JSON.stringify(body),
       QueueUrl: config.queueUrl
     };
 
     try {
        await sqs.sendMessage(params).promise();
     } catch(error) {
         console.log(error);
     }
}