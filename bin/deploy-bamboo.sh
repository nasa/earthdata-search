#!/bin/bash

# Bail on unset variables, errors and trace execution
set -eux

# Deployment configuration/variables
####################################

# Read in static.config.json
config="`cat static.config.json`"

# Update keys for deployment
config="`jq '.application.version = $newValue' --arg newValue ${RELEASE_VERSION} <<< $config`"
config="`jq '.application.env = $newValue' --arg newValue $bamboo_STAGE_NAME <<< $config`"
config="`jq '.application.defaultPortal = $newValue' --arg newValue $bamboo_DEFAULT_PORTAL <<< $config`"
config="`jq '.application.feedbackApp = $newValue' --arg newValue $bamboo_FEEDBACK_APP <<< $config`"
config="`jq '.application.analytics.gtmPropertyId = $newValue' --arg newValue $bamboo_GTM_ID <<< $config`"
config="`jq '.application.granuleLinksPageSize = $newValue' --arg newValue $bamboo_GRANULE_LINKS_PAGE_SIZE <<< $config`"
config="`jq '.application.openSearchGranuleLinksPageSize = $newValue' --arg newValue $bamboo_OPEN_SEARCH_GRANULE_LINKS_PAGE_SIZE <<< $config`"
config="`jq '.application.disableDatabaseComponents = $newValue' --arg newValue $bamboo_DISABLE_DATABASE_COMPONENTS <<< $config`"
config="`jq '.application.disableEddDownload = $newValue' --arg newValue $bamboo_DISABLE_EDD_DOWNLOAD <<< $config`"
config="`jq '.application.disableOrdering = $newValue' --arg newValue $bamboo_DISABLE_ORDERING <<< $config`"
config="`jq '.application.disableSiteTour = $newValue' --arg newValue $bamboo_DISABLE_SITE_TOUR <<< $config`"
config="`jq '.application.disableSwodlr = $newValue' --arg newValue $bamboo_DISABLE_SWODLR <<< $config`"
config="`jq '.application.macOSEddDownloadSize = $newValue' --arg newValue $bamboo_MACOS_EDD_DOWNLOAD_SIZE <<< $config`"
config="`jq '.application.windowsEddDownloadSize = $newValue' --arg newValue $bamboo_WINDOWS_EDD_DOWNLOAD_SIZE <<< $config`"
config="`jq '.application.linuxEddDownloadSize = $newValue' --arg newValue $bamboo_LINUX_EDD_DOWNLOAD_SIZE <<< $config`"
config="`jq '.application.collectionSearchResultsSortKey = $newValue' --arg newValue $bamboo_COLLECTION_SEARCH_RESULTS_SORT_KEY <<< $config`"
config="`jq '.environment.production.apiHost = $newValue' --arg newValue $bamboo_API_HOST <<< $config`"
config="`jq '.environment.production.edscHost = $newValue' --arg newValue $bamboo_EDSC_HOST <<< $config`"

# Overwrite static.config.json with new values
echo $config > tmp.$$.json && mv tmp.$$.json static.config.json

# Create an empty overrideStatic.config.json
echo {} > overrideStatic.config.json

# Create a dummy secret.config.json for now
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
**/node_modules
**/cdk.out
.DS_Store
.git
.github
.esbuild
.nyc_output
.webpack
coverage
test-results
playwright-coverage
playwright-report
dist
tmp
EOF

cat <<EOF > Dockerfile
FROM node:22
COPY . /build
WORKDIR /build
RUN npm ci --omit=dev
RUN npm run build
EOF

dockerTag=edsc-$bamboo_STAGE_NAME
docker build -t $dockerTag .

# Convenience function to invoke `docker run` with appropriate env vars instead of baking them into image
dockerRun() {
  docker run \
    -e "AWS_ACCESS_KEY_ID=$bamboo_AWS_ACCESS_KEY_ID" \
    -e "AWS_ACCOUNT=$bamboo_AWS_ACCOUNT" \
    -e "AWS_SECRET_ACCESS_KEY=$bamboo_AWS_SECRET_ACCESS_KEY" \
    -e "CLOUDFRONT_BUCKET_NAME=$bamboo_CLOUDFRONT_BUCKET_NAME" \
    -e "CLOUDFRONT_OAI_ID=$bamboo_CLOUDFRONT_OAI_ID" \
    -e "COLORMAP_JOB_ENABLED=$bamboo_COLORMAP_JOB_ENABLED" \
    -e "DB_ALLOCATED_STORAGE=$bamboo_DB_ALLOCATED_STORAGE" \
    -e "DB_INSTANCE_CLASS=$bamboo_DB_INSTANCE_CLASS" \
    -e "GIBS_JOB_ENABLED=$bamboo_GIBS_JOB_ENABLED" \
    -e "INTERNET_SERVICE_EAST_VPC=$bamboo_INTERNET_SERVICE_EAST_VPC" \
    -e "LAMBDA_TIMEOUT=$bamboo_LAMBDA_TIMEOUT" \
    -e "LOG_DESTINATION_ARN=$bamboo_LOG_DESTINATION_ARN" \
    -e "NODE_ENV=production" \
    -e "NODE_OPTIONS=--max_old_space_size=4096" \
    -e "OBFUSCATION_SPIN_SHAPEFILES=$bamboo_OBFUSCATION_SPIN_SHAPEFILES" \
    -e "OBFUSCATION_SPIN=$bamboo_OBFUSCATION_SPIN" \
    -e "ORDER_DELAY_SECONDS=$bamboo_ORDER_DELAY_SECONDS" \
    -e "S3_OBJECTS_EXPIRATION_IN_DAYS=$bamboo_S3_OBJECTS_EXPIRATION_IN_DAYS" \
    -e "SITE_BUCKET=$bamboo_SITE_BUCKET" \
    -e "STAGE_NAME=$bamboo_STAGE_NAME" \
    -e "SUBNET_ID_A=$bamboo_SUBNET_ID_A" \
    -e "SUBNET_ID_B=$bamboo_SUBNET_ID_B" \
    -e "USE_IMAGE_CACHE=$bamboo_USE_IMAGE_CACHE" \
    -e "VPC_ID=$bamboo_VPC_ID" \
    $dockerTag "$@"
}

# Execute cdk commands in Docker
#######################################

# Deploy AWS Infrastructure Resources
echo 'Deploying AWS Infrastructure Resources...'
dockerRun npm run deploy-infrastructure

# Deploy AWS Application Resources
echo 'Deploying AWS Application Resources...'
dockerRun npm run deploy-application

# Deploy static assets
echo 'Deploying static assets to S3...'
dockerRun npm run deploy-static
