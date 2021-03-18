#!/bin/bash
set -e

function cleanup()
{
    if [ ! -z ${PID_OF_LAMBDA+x} ]; then
        kill -SIGINT $PID_OF_LAMBDA
    fi
    docker-compose down
}

trap cleanup EXIT

npm run check
npm run test

docker-compose up -d

npx lambda-local -l src/index.js -h handler --watch 8081 &
PID_OF_LAMBDA=$!
sleep 1

aws --endpoint-url http://localhost:9324 sqs send-message --queue-url http://localhost:9324/queue/default --message-body "Testing" | cat

kill -0 $PID_OF_LAMBDA # Will exit if the lambda process is not running

npm run e2e