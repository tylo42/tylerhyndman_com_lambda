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