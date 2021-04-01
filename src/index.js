'use strict';


const database = require('./database/database.js');
const { dataServiceFactory } = require('./dataService.js');
const { publish } = require('./publish.js');
 
exports.handler = async () => {
    const dataService = dataServiceFactory(database);

    const body = await dataService.get();
    
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

    await publish(body);

    console.log("response: " + JSON.stringify(response))
    return response;
};
