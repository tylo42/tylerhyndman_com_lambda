'use strict';
 
const buildBody = require('./buildBody.js')
 
exports.handler = async () => {
    const body = await buildBody.build();
    
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials' : true,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    console.log("response: " + JSON.stringify(response))
    return response;
};
