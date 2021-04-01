#!/bin/bash
set -e

function cleanup()
{
    if [ ! -z ${PID_OF_LAMBDA+x} ]; then
        kill -SIGINT $PID_OF_LAMBDA
    fi
    npm run docker:stop
}

trap cleanup EXIT

npm run check
npm run test:unit

npm run docker:run

npx lambda-local -l src/index.js -h handler --watch 8081 &
PID_OF_LAMBDA=$!
sleep 1

aws --endpoint-url http://localhost:9324 sqs send-message --queue-url http://localhost:9324/queue/default --message-body "Testing" | cat
kill -0 $PID_OF_LAMBDA # Will exit if the lambda process is not running

npm run test:e2e