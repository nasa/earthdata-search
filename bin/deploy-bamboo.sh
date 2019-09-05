#!/bin/bash

# bail on unset variables
set -u

# Deployment configuration/variables
####################################

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
# RUN rm package-lock.json
RUN npm install && npm install -g serverless && npm run build
EOF

dockerTag=edsc-$bamboo_STAGE_NAME
docker build -t $dockerTag .

# convenience function to invoke `docker run` with appropriate env vars instead of baking them into image
dockerEnvRun() {
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

# Deploy AWS Resources
dockerEnvRun serverless deploy --stage $bamboo_STAGE_NAME

# Migrate the database
dockerEnvRun serverless invoke --function migrateDatabase --stage sit

# Deploy static assets
dockerEnvRun serverless client deploy --stage sit  --no-confirm