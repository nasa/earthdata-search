# [Earthdata Search](https://search.earthdata.nasa.gov)

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![Build Status](https://travis-ci.org/nasa/earthdata-search.svg?branch=EDSC-2133)](https://travis-ci.org/nasa/earthdata-search)

## About
Earthdata Search is a web application developed by [NASA](http://nasa.gov) [EOSDIS](https://earthdata.nasa.gov)
to enable data discovery, search, comparison, visualization, and access across EOSDIS' Earth Science data holdings.
It builds upon several public-facing services provided by EOSDIS, including
the [Common Metadata Repository (CMR)](https://cmr.earthdata.nasa.gov/search/) for data discovery and access,
EOSDIS [User Registration System (URS)](https://urs.earthdata.nasa.gov) authentication,
the [Global Imagery Browse Services (GIBS)](https://earthdata.nasa.gov/gibs) for visualization,
and a number of OPeNDAP services hosted by data providers.

## License

> Copyright © 2007-2019 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>    http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Application Installation and Usage

The Earthdata Search application uses Node v10.15.1 and Webpack 4.24.0 to generate static assets. The serverless application uses AWS Cloudfront, S3, and API Gateway to serve the application.

### Prerequisites

##### Node
Earthdata Search runs on Node.js, in order to run the application you'll need to [install it](https://nodejs.org/en/download/).

##### NPM
In order to run the application for development, you need a local install of [npm](https://www.npmjs.com/get-npm).

##### Serverless Framework
Earthdata Search utilizes the [Serverless Framework](https://serverless.com/) for managing AWS resources. In order to fully run and manage the application you'll need to install it:

    npm install -g serverless

##### PostgreSQL
Earthdata Search uses PostgreSQL in production on AWS RDS. If you don't already have it installed, [download](https://www.postgresql.org/download/) and install it to your development environment.

### Initial Setup

##### Package Installation

Once npm is installed locally, you need to download the dependencies by executing the command below in the project root directory:

    npm install

##### Database Migration

Ensure that you have a database created:

	createdb edsc_serverless_dev

Database credentials and other information are kept in `.env.development`, you'll need to update that file with your local database credentials to ensure migrations and general connectivity works. 

> NOTE: Depending on your setup, you may not have a uname/pw configured locally, if this is the case just leave those value blank in the config

    
Our database migrations run within Lambda due to the fact that in non-develoment environments our resources are not publicly accessible. To run the migrations you'll need to invoke the Lambda:

	serverless invoke local --function migrateDatabase


### Building the Application

The production build of the application will be output in the `/static/dist/` directory:

    npm run build
    
    
### Run the Application Locally

The local development environment for the static assets can be started by executing the command below in the project root directory:

    npm run start

This will run the React application at [http://localhost:8080](http://localhost:8080) -- please see `Serverless Framework` below for enabling the 'server' side functionality.
    

### Serverless Framework

The [serverless framework](https://serverless.com/framework/docs/providers/aws/) offers many plugins which allow for local development utilizing many of the services AWS offers. For the most part we only need API Gateway and Lambda for this application but there are plugins for many more services (a list of known exceptions will be maintained below).

##### Exceptions
- SQS

	While there is an sqs-offline plugin for servless it still requires an actual queue be running, we may investigate this in the future but for now sqs functionality isn't available while developing locally which means the following pieces of functionality will not operate locally:
	- Generating Colormaps

#### Running API Gateway and Lambda Locally

Running the following command will spin up API Gateway and Lambda locally which will open up a vast majority of the functionality the backend offers.

	serverless offline

This will provide access to API Gateway at [http://localhost:3001](http://localhost:3001)

Additionally, this ties in with the `serverless webpack` plugin which will ensure that your lambdas are re-built when changes are detected.


### Run the Automated [Jest](https://jestjs.io/) tests

Once the project is built, you must ensure that the automated tests pass:

    npm run test

### Deployment

When the time comes to deploy the application, first ensure that you have the required ENV vars set:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

To deploy the full application use the following:

	NODE_ENV=production serverless deploy
    
We specify `NODE_ENV` here because we are using `dotenv` which breaks our environment variables out into logical files that contain environment specific values. 