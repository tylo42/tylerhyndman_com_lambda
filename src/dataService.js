'use strict';

const MetaDataRepository = require("./database/metaDataReposiory");

class DataService {

    constructor(database, metaDataRepository) {
        this.database = database;
        this.metaDataRepository = metaDataRepository;
    }

    async get() {
        const [metadata, waypoints, flair] = await Promise.all([
            this.metaDataRepository.get(), 
            this.getWaypoints(), 
            this.getFlair()]);

        return {
            name: metadata.name,
            waypointTitle: metadata.waypointTitle,
            profileImage: metadata.profileImage,
            headImage: metadata.headImage,
            waypoints,
            flair
        }
    }
    
    async getWaypoints() {
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

exports.dataServiceFactory = (database) => {
    return new DataService(database, new MetaDataRepository(database));
}
