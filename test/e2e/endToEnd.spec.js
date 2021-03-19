'use strict';

const config = require('../../src/config.js');
const AWS = require('aws-sdk');

AWS.config.update(config.awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient();

const axios = require('axios');

const { expect } = require('chai');

describe("End to end test", () => {
    it('should pull data out of DynamoDb', async () => {
        await setUpDb();
        const sqsPromise = getSQSMessage()

        let response = await axios.get("http://localhost:8081", {
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                event: {}
            }
        });

        expect(response.status).to.equal(200);
        expect(response.data.data.headers).to.deep.equal({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json'
        });

        const expectedResponse = {
            "name": "Name",
            "waypointTitle": "Waypoint Title",
            "profileImage": "Profile Image",
            "headImage": "Head Image",
            "waypoints": [
                {
                    "title": "Title 2",
                    "role": "Role 2",
                    "location": "Location 2",
                    "link": "Link 2",
                    "details": [
                        "Details 2"
                    ],
                    "when": "2 - 3"
                },
                {
                    "title": "Title 1",
                    "role": "Role 1",
                    "location": "Location 1",
                    "link": "Link 1",
                    "details": [
                        "Details 1"
                    ],
                    "when": "1 - 2"
                }
            ],
            "flair": [
                {
                    "image": "Image 1",
                    "link": "Link 1"
                },
                {
                    "image": "Image 2",
                    "link": "Link 2"
                }
            ]
        }

        expect(JSON.parse(response.data.data.body)).to.deep.equal(expectedResponse);

        const messages = await sqsPromise;
        expect(messages.length).to.equal(1);
        expect(messages[0].Body).to.deep.equal(`const data = \`${JSON.stringify(expectedResponse)}\`;`);

    });

    async function getSQSMessage() {
        const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

        const QueueUrl = "http://localhost:9324/queue/default";

        const params = {
            AttributeNames: [],
            MaxNumberOfMessages: 10,
            MessageAttributeNames: [
               "All"
            ],
            QueueUrl,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 1
           };

        const data = await sqs.receiveMessage(params).promise();

        if(data.Messages) {
            await Promise.all(data.Messages.map(async m => {
                const deleteParams = {
                    QueueUrl,
                    ReceiptHandle: m.ReceiptHandle
                };
                await sqs.deleteMessage(deleteParams).promise()
            }))

            return data.Messages;
        } else {
            return [];
        }
    }

    async function setUpDb() {
        var dynamodb = new AWS.DynamoDB();

        await deleteAllTables(dynamodb);
        await createAllTables(dynamodb);
        await populateAllTables(dynamodb);
    }

    async function deleteAllTables(dynamodb) {
        return Promise.all(['metadata', 'waypoints', 'flair'].map(async TableName => {
            try {
                await dynamodb.deleteTable({TableName}).promise();
            } catch (err) {
                console.log(`Table ${TableName} did not exist`)
            }
        }));
    }

    async function createAllTables(dynamodb) {
        return Promise.all(
            [
                { tableName: 'metadata', key: 'name' },
                { tableName: 'waypoints', key: 'title' },
                { tableName: 'flair', key: 'id' },
            ].map(async data => {
                await createTable(dynamodb, data.tableName, data.key)
            })
        )
    }

    async function createTable(dynamodb, tableName, key) {
        const params = {
            TableName : tableName,
            KeySchema: [{ AttributeName: key, KeyType: "HASH"}],
            AttributeDefinitions: [{ AttributeName: key, AttributeType: "S" }],
            ProvisionedThroughput: {ReadCapacityUnits: 5, WriteCapacityUnits: 5}
        };

        try {
            await dynamodb.createTable(params).promise()
        } catch(err) {
            onsole.error("Error JSON.", JSON.stringify(err, null, 2));
        }
    }

    async function populateAllTables(dynamodb) {
        const params = {
            RequestItems: {
                'metadata': [
                    {
                        PutRequest: {
                            Item: {
                                name: {"S": "Name"},
                                headImage: {"S": "Head Image"},
                                profileImage: {"S": "Profile Image"},
                                waypointTitle: {"S": "Waypoint Title"},
                            }
                        }
                    }
                ],
                'waypoints': [
                    {
                        PutRequest: {
                            Item: {
                                title: {"S": "Title 1"},
                                details: {"SS": ["Details 1"]},
                                link: { "S": "Link 1" },
                                location: { "S": "Location 1"},
                                role: { "S": "Role 1"},
                                start: {"S": "1"},
                                end: {"S": "2"}
                            }
                        }
                    },
                    {
                        PutRequest: {
                            Item: {
                                title: {"S": "Title 2"},
                                details: {"SS": ["Details 2"]},
                                link: { "S": "Link 2" },
                                location: { "S": "Location 2"},
                                role: { "S": "Role 2"},
                                start: {"S": "2"},
                                end: {"S": "3"}
                            }
                        },
                    }
                ],
                'flair': [
                    {
                        PutRequest: {
                            Item: {
                                id: {"S": "1"},
                                image: {"S": "Image 1"},
                                link: { "S": "Link 1" }
                            }
                        }
                    },
                    {
                        PutRequest: {
                            Item: {
                                id: {"S": "2"},
                                image: {"S": "Image 2"},
                                link: { "S": "Link 2" }
                            }
                        },
                    }
                ]
            }
        }

        await dynamodb.batchWriteItem(params).promise();
    }
})