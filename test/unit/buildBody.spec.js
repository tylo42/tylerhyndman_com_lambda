'use strict';

const sinon = require('sinon');
const chai = require('chai');
const { expect } = require('chai');
const sinonChai = require('sinon-chai');

const BodyBuilder = require('../../src/buildBody.js');

chai.use(sinonChai);

describe('body builder', () => {
    afterEach(() => {
        sinon.restore();
    })

    const emtpyResponse = {
        Items: []
    };

    it('returns an empty object when all table results are empty', async () => {
        const database = {
            read: sinon.stub()
        }

        database.read.withArgs("metadata", 1).returns(emtpyResponse);
        database.read.withArgs("waypoints", 10).returns(emtpyResponse)
        database.read.withArgs("flair", 10).returns(emtpyResponse);

        const testObject = new BodyBuilder(database);

        const result = await testObject.build();

        expect(result).to.deep.equal({
            name: null,
            waypointTitle: null,
            profileImage: null,
            headImage: null,
            waypoints: [],
            flair: []
        });
    });

    it('returns the metadata from the database', async () => {
        const database = {
            read: sinon.stub()
        }

        database.read.withArgs("metadata", 1).returns({
            Items: [{
                name: "Name",
                waypointTitle: "Waypoint Title",
                profileImage: "Profile Image",
                headImage: "Head Image"
            }]
        });
        database.read.withArgs("waypoints", 10).returns(emtpyResponse)
        database.read.withArgs("flair", 10).returns(emtpyResponse);

        const testObject = new BodyBuilder(database);

        const result = await testObject.build();

        expect(result).to.deep.equal({
            name: "Name",
            waypointTitle: "Waypoint Title",
            profileImage: "Profile Image",
            headImage: "Head Image",
            waypoints: [],
            flair: []
        });
    });

    it('returns the sorted waypoints from the database', async () => {
        const database = {
            read: sinon.stub()
        }

        database.read.withArgs("metadata", 1).returns(emtpyResponse);
        database.read.withArgs("waypoints", 10).returns({
            Items: [
                {
                    title: "Title 1",
                    details: ["Details 1"],
                    link: "Link 1",
                    location: "Location 1",
                    role: "Role 1",
                    start: "2005",
                    end: "2009"
                },
                {
                    title: "Title 2",
                    details: ["Details 2"],
                    link: "Link 2",
                    location: "Location 2",
                    role: "Role 2",
                    start: "2001",
                    end: "2002"
                },
                {
                    title: "Title 3",
                    details: ["Details 3"],
                    link: "Link 3",
                    location: "Location 3",
                    role: "Role 3",
                    start: "2010"
                }
            ]
        })
        database.read.withArgs("flair", 10).returns(emtpyResponse);

        const testObject = new BodyBuilder(database);

        const result = await testObject.build();

        expect(result).to.deep.equal({
            name: null,
            waypointTitle: null,
            profileImage: null,
            headImage: null,
            waypoints: [
                {
                    title: "Title 3",
                    details: ["Details 3"],
                    link: "Link 3",
                    location: "Location 3",
                    role: "Role 3",
                    when: "Since 2010"
                },
                {
                    title: "Title 1",
                    details: ["Details 1"],
                    link: "Link 1",
                    location: "Location 1",
                    role: "Role 1",
                    when: "2005 - 2009"
                },
                {
                    title: "Title 2",
                    details: ["Details 2"],
                    link: "Link 2",
                    location: "Location 2",
                    role: "Role 2",
                    when: "2001 - 2002"
                }
            ],
            flair: []
        });
    });

    it('returns the sorted flair from the database', async () => {
        const database = {
            read: sinon.stub()
        }

        database.read.withArgs("metadata", 1).returns(emtpyResponse);
        database.read.withArgs("waypoints", 10).returns(emtpyResponse)
        database.read.withArgs("flair", 10).returns({
            Items: [
                {
                    id: 2,
                    image: "Image 1",
                    link: "Link 1"
                },
                {
                    id: 3,
                    image: "Image 2",
                    link: "Link 2"
                },
                {
                    id: 1,
                    image: "Image 3",
                    link: "Link 3"
                },
            ]
        });

        const testObject = new BodyBuilder(database);

        const result = await testObject.build();

        expect(result).to.deep.equal({
            name: null,
            waypointTitle: null,
            profileImage: null,
            headImage: null,
            waypoints: [],
            flair: [
                {
                    image: "Image 3",
                    link: "Link 3"
                },
                {
                    image: "Image 1",
                    link: "Link 1"
                },
                {
                    image: "Image 2",
                    link: "Link 2"
                },
            ]
        });
    });
})