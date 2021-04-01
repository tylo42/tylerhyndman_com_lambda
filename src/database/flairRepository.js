'use strict';

class FlairRepository {
    constructor(database) {
        this.database = database;
    }

    async get() {
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

module.exports = FlairRepository;