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
config="`jq '.application.defaultPortal = $newValue' --arg newValue $bamboo_DEFAULT_PORTAL <<< $config`"
config="`jq '.application.feedbackApp = $newValue' --arg newValue $bamboo_FEEDBACK_APP <<< $config`"
config="`jq '.application.analytics.gtmPropertyId = $newValue' --arg newValue $bamboo_GTM_ID <<< $config`"
config="`jq '.application.granuleLinksPageSize = $newValue' --arg newValue $bamboo_GRANULE_LINKS_PAGE_SIZE <<< $config`"
config="`jq '.application.openSearchGranuleLinksPageSize = $newValue' --arg newValue $bamboo_OPEN_SEARCH_GRANULE_LINKS_PAGE_SIZE <<< $config`"
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
.DS_Store
.git
.github
.serverless
.webpack
coverage
cypress
dist
node_modules
tmp
EOF

cat <<EOF > Dockerfile
FROM node:14.18
COPY . /build
WORKDIR /build
RUN npm ci --production && npm run build
EOF

dockerTag=edsc-$bamboo_STAGE_NAME
docker build -t $dockerTag .

# Convenience function to invoke `docker run` with appropriate env vars instead of baking them into image
dockerRun() {
    docker run \
        -e "AWS_ACCESS_KEY_ID=$bamboo_AWS_ACCESS_KEY_ID" \
        -e "AWS_SECRET_ACCESS_KEY=$bamboo_AWS_SECRET_ACCESS_KEY" \
        -e "CLOUDFRONT_BUCKET_NAME=$bamboo_CLOUDFRONT_BUCKET_NAME" \
        -e "COLORMAP_JOB_ENABLED=$bamboo_COLORMAP_JOB_ENABLED" \
        -e "DB_INSTANCE_CLASS=$bamboo_DB_INSTANCE_CLASS" \
        -e "GEOCODING_INCLUDE_POLYGONS=$bamboo_GEOCODING_INCLUDE_POLYGONS" \
        -e "GEOCODING_SERVICE=$bamboo_GEOCODING_SERVICE" \
        -e "GIBS_JOB_ENABLED=$bamboo_GIBS_JOB_ENABLED" \
        -e "LAMBDA_TIMEOUT=$bamboo_LAMBDA_TIMEOUT" \
        -e "LOG_DESTINATION_ARN=$bamboo_LOG_DESTINATION_ARN" \
        -e "NODE_ENV=production" \
        -e "NODE_OPTIONS=--max_old_space_size=4096" \
        -e "OBFUSCATION_SPIN_SHAPEFILES=$bamboo_OBFUSCATION_SPIN_SHAPEFILES" \
        -e "OBFUSCATION_SPIN=$bamboo_OBFUSCATION_SPIN" \
        -e "SUBNET_ID_A=$bamboo_SUBNET_ID_A" \
        -e "SUBNET_ID_B=$bamboo_SUBNET_ID_B" \
        -e "SUBSETTING_JOB_ENABLED=$bamboo_SUBSETTING_JOB_ENABLED" \
        -e "VPC_ID=$bamboo_VPC_ID" \
        $dockerTag "$@"
}

# Execute serverless commands in Docker
#######################################

stageOpts="--stage $bamboo_STAGE_NAME"

# Deploy AWS Infrastructure Resources
echo 'Deploying AWS Infrastructure Resources...'
dockerRun npx serverless deploy $stageOpts --config serverless-infrastructure.yml

# Deploy AWS Application Resources
echo 'Deploying AWS Application Resources...'
dockerRun npx serverless deploy $stageOpts

# Migrate the database
echo 'Migrating the database...'
dockerRun npx serverless invoke $stageOpts --function migrateDatabase

# Deploy static assets
echo 'Deploying static assets to S3...'
dockerRun npx serverless client deploy $stageOpts --no-confirm
