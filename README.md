# [Earthdata Search](https://search.earthdata.nasa.gov)

![Build Status](https://github.com/nasa/earthdata-search/workflows/CI/badge.svg?branch=main)
[![codecov](https://codecov.io/gh/nasa/earthdata-search/branch/main/graph/badge.svg?token=kIkZQ0NrqK)](https://codecov.io/gh/nasa/earthdata-search)
[![Known Vulnerabilities](https://snyk.io/test/github/nasa/earthdata-search/badge.svg)](https://snyk.io/test/github/nasa/earthdata-search)

## About

Earthdata Search is a web application developed by [NASA](http://nasa.gov) [EOSDIS](https://earthdata.nasa.gov) to enable data discovery, search, comparison, visualization, and access across EOSDIS' Earth Science data holdings.
It builds upon several public-facing services provided by EOSDIS, including the [Common Metadata Repository (CMR)](https://cmr.earthdata.nasa.gov/search/) for data discovery and access, EOSDIS [Earthdata Login (EDL)](https://urs.earthdata.nasa.gov) authentication, the [Global Imagery Browse Services (GIBS)](https://earthdata.nasa.gov/gibs) for visualization, and a number of OPeNDAP services hosted by data providers.

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

The Earthdata Search application uses NodeJS and Vite to generate static assets. The serverless application utilizes the following AWS services (important to note if deploying to an AWS environment):

- S3
  - We highly recommend using CloudFront in front of S3.
- SQS
- Step Functions
- API Gateway
- Lambda
- Cloudwatch (Events)

### Prerequisites

#### NodeJS

We recommend using [Node Version Manager](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) (NVM) to manage your NodeJS install. Use the shell integration to [automatically switch Node versions](https://github.com/nvm-sh/nvm?tab=readme-ov-file#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file).

NVM will automatically install the correct node version defined in `.nvmrc`

    nvm use

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

##### Docker, Optional

Docker is used to simulate SQS locally using [ElasticMQ](https://github.com/softwaremill/elasticmq).

##### Redis, Optional

To use an image cache you need to have Redis installed.

**Recommended:** Use Homebrew

    brew install redis

Optionally you can run Redis in a Docker container with

    npm run start:cache

To stop the Redis Docker container

    npm run stop:cache

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

    npm run invoke-local migrateDatabase

###### Creating a new database migration

To create a new database migration use this command to ensure the migration follow the same timestamp name scheme.

    npm run migrate create name-of-migration

### Run the Application Locally

The local development environment for the static assets can be started by executing the command below in the project root directory:

    npm start

This will start everything you need to run Earthdata Search locally.

- React application: [http://localhost:8080](http://localhost:8080)
- Mock API Gateway: [http://localhost:3001](http://localhost:3001)
- Watch for code changes to the `serverless` directory
- ElasticMQ container for SQS Queues.
- Mock SQS service to trigger lambdas on SQS messages.
- Mock S3 service for generating notebooks.

#### Optional Services

By default we don't run SQS or an image cache locally. In order to run the application with those services you need to include the follow environment variables when you start the application

    USE_IMAGE_CACHE=true SKIP_SQS=false npm start

Or run

    npm run start:optionals

### Building the Application

The production build of the application will be output in the `/static/dist/` directory:

    npm run build

This production build can be run locally with any number of http-server solutions. A simple one is to use the http-server package

    npx http-server static/dist

### Invoking lambdas locally

To invoke lambdas locally we must create a stringified JSON file with the order information to the specific lambda we are trying to run the structure of the events will differ between the lambda. Typically this will include data from your local database instance which is used in the event information.

    npm run invoke-local <name-of-lambda-function> ./path/to/event.json

### Pulling down colormaps locally

Run the application with optionals on then use

    npm run invoke-local generateColorMaps ./tmp/generate_colormaps.json

with a JSON object of

{
  "projection": <projection-code>
}

### Run the Automated [Jest](https://jestjs.io/) tests

Once the project is built, you must ensure that the automated unit tests pass:

    npm run test

To run Jest in `watch` mode

    npm run test:watch

To only get coverage on files tested run

    npm run test:watch-lite

Test coverage will be updated in the coverage directory to see breakdown use

    open coverage/lcov-report/index.html

### Run the Automated [Playwright](https://playwright.dev/) tests

To run Playwright tests, you must first install Playwright:

    npx playwright install  

To run Playwright in `ui` mode:

    npm run playwright:ui

To run Playwright tests in headless mode:

    npm run playwright

### Deployment

When the time comes to deploy the application, first ensure that you have the required ENV vars set:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- STAGE_NAME

This application runs in a VPC for NASA security purposes, therefore the following values are expected when a deployment occurs:

- VPC_ID
- SUBNET_ID_A
- SUBNET_ID_B
- INTERNET_SERVICE_EAST_VPC

For production use, this application uses Scatter Swap to obfuscate some IDs -- the library does not require a value be provided but if you'd like to control it you can set the following ENV vars:

- OBFUSCATION_SPIN
- OBFUSCATION_SPIN_SHAPEFILES

To deploy the full application use the following:

    bin/deploy_bamboo.sh

Note: In that script all the env variables are prefixed with `bamboo_` to match our deployments.
