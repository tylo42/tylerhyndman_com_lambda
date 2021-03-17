'use strict';

class BodyBuilder {

    constructor(database) {
        this.database = database;
    }

    async build() {
        const [metadata, waypoints, flair] = await Promise.all([this.getMetaData(), this.getWaypoints(), this.getFlair()]);

        return {
            name: metadata.name,
            waypointTitle: metadata.waypointTitle,
            profileImage: metadata.profileImage,
            headImage: metadata.headImage,
            waypoints,
            flair
        }
    }
    
    async getMetaData() {
        const metadata = await this.database.read('metadata', 1);
        const firstItem = metadata.Items[0];

        return {
            name: (firstItem) ? firstItem.name : null,
            waypointTitle: (firstItem) ? firstItem.waypointTitle : null,
            profileImage: (firstItem) ? firstItem.profileImage : null,
            headImage: (firstItem) ? firstItem.headImage : null
        }
    }
    
    async getWaypoints() {
        return (await this.database.read('waypoints', 10)).Items
            .sort((a, b) => (a.start < b.start) ? 1 : -1)
            .map(this.transformWaypoint);
    }

    transformWaypoint(waypoint) {
        const result = Object.assign({}, waypoint)

        result.when = (waypoint.end) ? 
                `${waypoint.start} - ${waypoint.end}` :
                `Since ${waypoint.start}`
        delete result.start;
        delete result.end;

        return result;
    }
    
    async getFlair() {
        return (await this.database.read('flair', 10)).Items
            .sort((a, b) => (a.id > b.id) ? 1 : -1)
            .map(this.transformFlair);
    }

    transformFlair(flair) {
        return {
            image: flair.image,
            link: flair.link
        }
    }
}

module.exports = BodyBuilder
