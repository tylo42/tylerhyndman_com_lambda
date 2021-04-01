'use strict';

class MetaDataRepository {
    constructor(database) {
        this.database = database;
    }

    async get() {
        const metadata = await this.database.read('metadata', 1);
        const firstItem = metadata.Items[0];
    
        return {
            name: (firstItem) ? firstItem.name : null,
            waypointTitle: (firstItem) ? firstItem.waypointTitle : null,
            profileImage: (firstItem) ? firstItem.profileImage : null,
            headImage: (firstItem) ? firstItem.headImage : null
        }
    }
}

module.exports = MetaDataRepository
