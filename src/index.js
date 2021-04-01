'use strict';


const database = require('./database/database.js');
const MetaDataRepository = require('./database/metaDataReposiory');
const DataService = require('./dataService.js');
const { publish } = require('./publish.js');
 
exports.handler = async () => {
    const bodyBuilder = new DataService(database, new MetaDataRepository(database));

    const body = await bodyBuilder.get();
    
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
