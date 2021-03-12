#!/bin/bash
set -e

ENVIRONMENT_FILE="./environment.sh"

if [ ! -f "${ENVIRONMENT_FILE}" ]; then
   echo "${ENVIRONMENT_FILE} does not exist.";
   echo 'Expect the file to contain a $FUNCTION_NAME variable initialized to the function arn to deploy to';
   exit;
fi

source $ENVIRONMENT_FILE

if [ -z "${FUNCTION_NAME}" ]; then
   echo 'Expected variable $FUNCTIOIN_NAME is not set';
   exit;
fi

rm -r dist || true;
mkdir -p dist;
zip -j dist/lambda.zip ./src/index.js;

aws lambda update-function-code \
   --function-name $FUNCTION_NAME \
   --zip-file fileb://dist/lambda.zip | cat;
