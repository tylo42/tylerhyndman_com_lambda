# tylerhyndman.com AWS Lambda

An AWS Lambda that pulls data out of multiple DynamoDB tables and returns them in JSON format.

To deploy it is expected that there exists a `./environment.sh` (not checked in to source) file in the root of the project of the format

```
#!/bin/bash

FUNCTION_NAME=<AWS-function-arn>
```
