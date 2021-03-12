'use strict';

const database = require('./database.js');

exports.build = async () => {
    const [metadata, waypoints, flair] = await Promise.all([getMetaData(), getWaypoints(), getFlair()]);

    return {
        name: metadata.name,
        waypointTitle: metadata.waypointTitle,
        waypoints,
        flair
    }
}

async function getMetaData() {
    const metadata = await database.read('metadata', 1)

    return {
        name: metadata.Items[0].name,
        waypointTitle: metadata.Items[0].waypointTitle,
    }
}

async function getWaypoints() {
    const waypoints = await database.read('waypoints', 10)

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
    const flair = await database.read('flair', 10)

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