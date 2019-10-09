#!/bin/bash

# Bail on unset variables, errors and trace execution
set -eux

# Deployment configuration/variables
####################################

# read in static.config.json
config="`cat static.config.json`"

# update keys for deployment
config="`jq '.application.version = $newValue' --arg newValue ${RELEASE_VERSION} <<< $config`"
config="`jq '.application.env = $newValue' --arg newValue $bamboo_STAGE_NAME <<< $config`"
config="`jq '.environment.production.apiHost = $newValue' --arg newValue $bamboo_API_HOST <<< $config`"
config="`jq '.environment.production.edscHost = $newValue' --arg newValue $bamboo_EDSC_HOST <<< $config`"

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
RUN npm install && npm install -g serverless@1.51.0 && npm run build
EOF

dockerTag=edsc-$bamboo_STAGE_NAME
docker build -t $dockerTag .

# Convenience function to invoke `docker run` with appropriate env vars instead of baking them into image
dockerRun() {
    docker run \
        -e "NODE_ENV=production" \
        -e "AWS_ACCESS_KEY_ID=$bamboo_AWS_ACCESS_KEY_ID" \
        -e "AWS_SECRET_ACCESS_KEY=$bamboo_AWS_SECRET_ACCESS_KEY" \
        -e "DB_INSTANCE_CLASS=$bamboo_DB_INSTANCE_CLASS" \
        -e "OBFUSCATION_SPIN=$bamboo_OBFUSCATION_SPIN" \
        -e "OBFUSCATION_SPIN_SHAPEFILES=$bamboo_OBFUSCATION_SPIN_SHAPEFILES" \
        -e "LOG_DESTINATION_ARN=$bamboo_LOG_DESTINATION_ARN" \
        -e "VPC_ID=$bamboo_VPC_ID" \
        -e "SUBNET_ID_A=$bamboo_SUBNET_ID_A" \
        -e "SUBNET_ID_B=$bamboo_SUBNET_ID_B" \
        -e "WARM_LAMBDA_COUNT=$bamboo_WARM_LAMBDA_COUNT" \
        -e "WARM_LAMBDA_SCHEDULE=$bamboo_WARM_LAMBDA_SCHEDULE" \
        $dockerTag "$@"
}

# Execute serverless commands in Docker
#######################################

stageOpts="--stage $bamboo_STAGE_NAME"

# Deploy AWS Infrastructure Resources
echo 'Deploying AWS Infrastructure Resources...'
dockerRun serverless deploy $stageOpts --config serverless-infrastructure.yml

# Deploy AWS Application Resources
echo 'Deploying AWS Application Resources...'
dockerRun serverless deploy $stageOpts

# Migrate the database
echo 'Migrating the database...'
dockerRun serverless invoke $stageOpts --function migrateDatabase

# Deploy static assets
echo 'Deploying static assets to S3...'
dockerRun serverless client deploy $stageOpts --no-confirm
