#!/bin/bash

# bail on unset variables
set -u

# Deployment configuration/variables
####################################

# read in static.config.json
config="`cat static.config.json`"

# update keys for deployment
config="`jq '.application.version = $newValue' --arg newValue ${RELEASE_VERSION} <<< $config`"
config="`jq '.application.env = $newValue' --arg newValue $bamboo_STAGE_NAME <<< $config`"
config="`jq '.environment.production.apiHost = $newValue' --arg newValue $bamboo_API_HOST <<< $config`"
config="`jq '.earthdata.sit.edscHost = $newValue' --arg newValue $bamboo_EDSC_HOST <<< $config`"
config="`jq '.earthdata.uat.edscHost = $newValue' --arg newValue $bamboo_EDSC_HOST <<< $config`"
config="`jq '.earthdata.prod.edscHost = $newValue' --arg newValue $bamboo_EDSC_HOST <<< $config`"

# overwrite static.config.json with new values
echo $config > tmp.$$.json && mv tmp.$$.json static.config.json

# create a dummy secret.config.json for now
cat <<EOF > secret.config.json
{
  "earthdata": {
    "sit": {
      "secret": "$bamboo_JWT_SIGNING_SECRET_KEY"
    },
    "uat": {
      "secret": "$bamboo_JWT_SIGNING_SECRET_KEY"
    },
    "prod": {
      "secret": "$bamboo_JWT_SIGNING_SECRET_KEY"
    }
  }
}
EOF

# Set up Docker image
#####################

cat <<EOF > .dockerignore
node_modules
.serverless
EOF

cat <<EOF > Dockerfile
FROM node:10.15
COPY . /build
WORKDIR /build
RUN npm install && npm install -g serverless && npm run build
EOF

dockerTag=edsc-$bamboo_STAGE_NAME
docker build -t $dockerTag .

# convenience function to invoke `docker run` with appropriate env vars instead of baking them into image
dockerRun() {
    docker run \
        -e "NODE_ENV=production" \
        -e "AWS_ACCESS_KEY_ID=$bamboo_AWS_ACCESS_KEY_ID" \
        -e "AWS_SECRET_ACCESS_KEY=$bamboo_AWS_SECRET_ACCESS_KEY" \
        -e "OBFUSCATION_SPIN=$bamboo_OBFUSCATION_SPIN" \
        -e "VPC_ID=$bamboo_VPC_ID" \
        -e "SUBNET_ID_A=$bamboo_SUBNET_ID_A" \
        -e "SUBNET_ID_B=$bamboo_SUBNET_ID_B" \
        $dockerTag "$@"
}

# Execute serverless commands in Docker
#######################################

stageOpts="--stage $bamboo_STAGE_NAME"

# Deploy AWS Resources
dockerRun serverless deploy $stageOpts

# Migrate the database
dockerRun serverless invoke $stageOpts --function migrateDatabase

# Deploy static assets
dockerRun serverless client deploy $stageOpts --no-confirm
