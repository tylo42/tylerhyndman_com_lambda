'use strict';
 
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'})
 
exports.handler = async (event) => {
    console.log("request: " + JSON.stringify(event));

    const [metadata, waypoints, flair] = await Promise.all([getMetaData(), getWaypoints(), getFlair()]);

    const body = {
        name: metadata.name,
        waypointTitle: metadata.waypointTitle,
        waypoints,
        flair
    }
    
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

async function getWaypoints() {
    console.log("Scanning dynamoDb table: waypoints");
    
    let scanningParameters = {
        TableName: 'waypoints',
        Limit: 10
    };
    
    const waypoints = await docClient.scan(scanningParameters).promise();

    waypoints.Items.sort((a, b) => {
        var ap = a.start;
        var bp = b.start;

        if(ap > bp) {
           return -1;
        } else if(ap < bp) {
           return 1;
        } else {
           return 0;
        }
    });

    waypoints.Items.map(waypoint => {
        if(waypoint.end) {
            waypoint.when = `${waypoint.start} - ${waypoint.end}`
        } else {
            waypoint.when = `Since ${waypoint.start}`
        }

    });
    
    return waypoints.Items;
}

async function getFlair() {
    console.log("Scanning dynamoDb table: flair");
    
    let scanningParameters = {
        TableName: 'flair',
        Limit: 10
    };
    
    const flair = await docClient.scan(scanningParameters).promise();

    flair.Items.sort((a, b) => {
        var ap = a.id;
        var bp = b.id;

        if(ap < bp) {
           return -1;
        } else if(ap > bp) {
           return 1;
        } else {
           return 0;
        }
    });
    
    return flair.Items;
}

async function getMetaData() {
    console.log("Scanning dynamoDb table: metadata");
    
    let scanningParameters = {
        TableName: 'metadata',
        Limit: 1
    };
    
    const metadata = await docClient.scan(scanningParameters).promise();

    return {
        name: metadata.Items[0].name,
        waypointTitle: metadata.Items[0].waypointTitle,
    }
}
