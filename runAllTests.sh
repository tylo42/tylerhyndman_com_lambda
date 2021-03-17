#!/bin/bash
set -e

npm run check
npm run test

docker-compose up -d
npx lambda-local -l src/index.js -h handler --watch 8081 &

PID_OF_LAMBDA=$!

sleep 1

kill -0 $PID_OF_LAMBDA

npm run e2e

kill -SIGINT $PID_OF_LAMBDA
docker-compose down