# [Earthdata Search](https://search.earthdata.nasa.gov)

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
![Build Status](https://github.com/nasa/earthdata-search/workflows/CI/badge.svg?branch=main)
[![codecov](https://codecov.io/gh/nasa/earthdata-search/branch/main/graph/badge.svg?token=kIkZQ0NrqK)](https://codecov.io/gh/nasa/earthdata-search)
[![Known Vulnerabilities](https://snyk.io/test/github/nasa/earthdata-search/badge.svg)](https://snyk.io/test/github/nasa/earthdata-search)

## About

Earthdata Search is a web application developed by [NASA](http://nasa.gov) [EOSDIS](https://earthdata.nasa.gov) to enable data discovery, search, comparison, visualization, and access across EOSDIS' Earth Science data holdings.
It builds upon several public-facing services provided by EOSDIS, including the [Common Metadata Repository (CMR)](https://cmr.earthdata.nasa.gov/search/) for data discovery and access, EOSDIS [User Registration System (URS)](https://urs.earthdata.nasa.gov) authentication, the [Global Imagery Browse Services (GIBS)](https://earthdata.nasa.gov/gibs) for visualization, and a number of OPeNDAP services hosted by data providers.

## License

> Copyright © 2007-2024 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
> <http://www.apache.org/licenses/LICENSE-2.0>
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Application Installation and Usage

The Earthdata Search application uses Node v18 and Vite 5 to generate static assets. The serverless application utilizes the following AWS services (important to note if deploying to an AWS environment):

- S3
  - We highly recommend using CloudFront in front of S3.
- SQS
- API Gateway
- Lambda
- Cloudwatch (Events)

### Prerequisites

##### Node

Earthdata Search runs on Node.js, in order to run the application you'll need to [install it](https://nodejs.org/en/download/).

**Recommended:** Use Homebrew

    brew install node

##### NPM

npm is a separate project from Node.js, and tends to update more frequently. As a result, even if you’ve just downloaded Node.js (and therefore npm), you’ll probably need to update your npm. Luckily, npm knows how to update itself! To update your npm, type this into your terminal:

    npm install -g npm@latest

##### NVM

To ensure that you're using the correct version of Node it is recommended that you use Node Version Manager. Installation instructions can be found on [the repository](https://github.com/nvm-sh/nvm#install--update-script). The version used is defined in .nvmrc and will be used automatically if NVM is configured correctly. Using nvm we can switch node versions to the one utilized by Earthdata Search. From the top-level directory:

    nvm use

##### Serverless Framework

Earthdata Search utilizes the [Serverless Framework](https://serverless.com/) for managing AWS resources. In order to fully run and manage the application you'll need to install it:

    npm install -g serverless@latest

##### PostgreSQL

Earthdata Search uses PostgreSQL in production on AWS RDS. If you don't already have it installed, [download](https://www.postgresql.org/download/) and install it to your development environment.

**Recommended:** Use Homebrew

    brew install postgresql

Start the PostgreSQL server:

    # If you have never used brew services before:
    brew tap homebrew/services
    
    # Start the server:
    brew services start postgresql

If you decide to install via Homebrew you'll need to create the default user.

    createuser -s postgres

### Initial Setup

##### Package Installation

Once npm is installed locally, you need to download the dependencies by executing the command below in the project root directory:

    npm install

##### Configuration

###### Secrets

For local development Earthdata Search uses a json configuration file to store secure files, an example is provided and should be copied and completed before attempting to go any further.

    cp secret.config.json.example secret.config.json

In order to operate against a local database this file will need `dbUsername` and `dbPassword` values set (you may need to update `dbHost`, `dbName` or `databasePort` in `static.config.json` if you have custom configuration locally).

If you created the `postgres` user after a new PostgreSQL install as described above, both `dbUsername` and `dbPassword` will be the username you use to log into your computer.

###### Public (Non-Secure)

Non-secure values are stored in `static.config.json`. In order to prevent conflicts amongst developers you copy the static config into `overrideStatic.config.json` and change the config values there. Do not commit changes to `static.config.json`.

    cp static.config.json overrideStatic.config.json

We can configure some of the layouts for the EDSC presentation by updating the `defaultPortal` value in `overrideStatic.config.json`. For development purposes we should set this to `edsc`.

##### Database Migration

Ensure that you have a database created:

    createdb edsc_dev

To run the migrations locally:

    DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/edsc_dev npm run migrate up

Optionally, we can run the migration locally and not within a deployed Lambda. When deployed our database migrations run within Lambda due to the fact that in non-development environments our resources are not publicly accessible. To run the migrations you'll need to invoke the Lambda:

    serverless invoke local --function migrateDatabase

### Building the Application

The production build of the application will be output in the `/static/dist/` directory:

    npm run build

This production build can be run locally with any number of http-server solutions. A simple one is to use the http-server package

    npx http-server static/dist

### Run the Application Locally

The local development environment for the static assets can be started by executing the command below in the project root directory:

    npm run start

This will run the React application at [http://localhost:8080](http://localhost:8080) -- please see `Serverless Framework` below for enabling the 'server' side functionality.

### Serverless Framework

The [serverless framework](https://serverless.com/framework/docs/providers/aws/) offers many plugins which allow for local development utilizing many of the services AWS offers. For the most part we only need API Gateway and Lambda for this application but there are plugins for many more services (a list of known exceptions will be maintained below).

##### Exceptions

- SQS

 While there is an sqs-offline plugin for serverless it still requires an actual queue be running, we may investigate this in the future but for now sqs functionality isn't available while developing locally which means the following pieces of functionality will not operate locally:

- Generating Colormaps

- Scale images

Scaling thumbnail images utilizes a redis cache in the deployed environment. To utilize this cache locally you'll need to install Redis on the dev machine. The easiest way to do this would be by running it in a docker container using the command `npm run start:cache`. You can also use a visualizer such as `RedisInsight` to more easily inspect the cache. You will also need to set the environment variable `USE_CACHE` locally to `true` with `export USE_CACHE=true` or add the environment variable to your shell script. To stop the docker container use the `npm run stop:cache` command.

#### Running API Gateway and Lambda Locally

Running the following command will spin up API Gateway and Lambda locally which will open up a vast majority of the functionality the backend offers.

    npm run offline

This will provide access to API Gateway at [http://localhost:3001](http://localhost:3001)

Additionally, this ties in with `esbuild` which will ensure that your lambdas are re-built when changes are detected.

### Invoking lambdas locally

To invoke lambdas locally we must create a stringified JSON file with the order information to the specific lambda we are trying to run the structure of the events will differ between the lambda. Typically this will include data from your local database instance which is used in the event information.

    npm run invoke-local -- --function <name-of-lambda-function> --path ./event.json

You may need to also set the `IS_OFFLINE` environment variable when invoking the lambda locally

    export IS_OFFLINE=true

### Run the Automated [Jest](https://jestjs.io/) tests

Once the project is built, you must ensure that the automated unit tests pass:

    npm run test

To get coverage on modules run
    npm run test:watch-lite

test coverage will be updated in the coverage directory to see breakdown use
    open coverage/lcov-report/index.html

### Deployment

When the time comes to deploy the application, first ensure that you have the required ENV vars set:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

This application runs in a VPC for NASA security purposes, therefore the following values are expected when a deployment occurs:

- VPC_ID
- SUBNET_ID_A
- SUBNET_ID_B

For production use, this application uses Scatter Swap to obfuscate some IDs -- the library does not require a value be provided but if you'd like to control it you can set the following ENV vars:

- OBFUSCATION_SPIN
- OBFUSCATION_SPIN_SHAPEFILES

To deploy the full application use the following:

    NODE_ENV=production serverless deploy --stage UNIQUE_STAGE
