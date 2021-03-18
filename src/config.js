'use strict';

if(process.env.REGION && process.env.REGION !== "") {
    exports.awsConfig = {
        region: process.env.REGION
    }
} else {
    exports.awsConfig = {
        region: 'local',
        endpoint: 'http://localhost:8080'
    }
}

if(process.env.QUEUE_URL && process.env.QUEUE_URL !== "") {
    exports.queueUrl = process.env.QUEUE_URL;
} else {
    exports.queueUrl = "http://localhost:9324/queue/default"
}