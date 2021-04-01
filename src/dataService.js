'use strict';

const MetaDataRepository = require("./database/metaDataReposiory");
const WaypointRepository = require("./database/waypointRepository");
const FlairRepository = require("./database/flairRepository");

class DataService {

    constructor(database, metaDataRepository, waypointRepository, flairRepository) {
        this.database = database;
        this.metaDataRepository = metaDataRepository;
        this.waypointRepository = waypointRepository;
        this.flairRepository = flairRepository;
    }

    async get() {
        const [metadata, waypoints, flair] = await Promise.all([
            this.metaDataRepository.get(), 
            this.waypointRepository.get(), 
            this.flairRepository.get()
        ]);

        return {
            name: metadata.name,
            waypointTitle: metadata.waypointTitle,
            profileImage: metadata.profileImage,
            headImage: metadata.headImage,
            waypoints,
            flair
        }
    }
}

exports.dataServiceFactory = (database) => {
    return new DataService(database, 
        new MetaDataRepository(database),
        new WaypointRepository(database),
        new FlairRepository(database)
    );
}
