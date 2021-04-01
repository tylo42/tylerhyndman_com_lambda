'use strict';

class WaypointRepository {
    constructor(database) {
        this.database = database;
    }

    async get() {
        return (await this.database.read('waypoints', 10)).Items
            .sort((a, b) => (a.start < b.start) ? 1 : -1)
            .map(this.transformWaypoint);
    }

    transformWaypoint(waypoint) {
        return {
            title: waypoint.title,
            role: waypoint.role,
            location: waypoint.location,
            link: waypoint.link,
            details: waypoint.details,
            when:  (waypoint.end) ? 
                        `${waypoint.start} - ${waypoint.end}` :
                        `Since ${waypoint.start}`
        }
    }
    
}

module.exports = WaypointRepository;
