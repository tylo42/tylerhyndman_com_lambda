'use strict';

const MetaDataRepository = require("./database/metaDataReposiory");
const WaypointRepository = require("./database/waypointRepository");

class DataService {

    constructor(database, metaDataRepository, waypointRepository) {
        this.database = database;
        this.metaDataRepository = metaDataRepository;
        this.waypointRepository = waypointRepository;
    }

    async get() {
        const [metadata, waypoints, flair] = await Promise.all([
            this.metaDataRepository.get(), 
            this.waypointRepository.get(), 
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
    return new DataService(database, 
        new MetaDataRepository(database),
        new WaypointRepository(database));
}
