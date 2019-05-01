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

## Application Installation and Usage

The Earthdata Search application uses Node v10.15.1 and Webpack 4.24.0 to generate static assets. The serverless application uses AWS Cloudfront, S3, and API Gateway to serve the application.

In order to run the application for development, you need a local install of [npm](https://www.npmjs.com/).

### Initial Setup

Once npm is installed locally, you need to download the dependencies by executing the command below in the project root directory:

    npm install

### Building the Application

The production build of the application will be output in the `/static/dist/` directory:

    npm run build

### Run the Automated [Jest](https://jestjs.io/) tests

Once the project is built, you must ensure that the automated tests pass:

    npm run test

All tests should pass in less than a few minutes.

### Run the Application Locally

The local development environment for the static assets can be started by executing the command below in the project root directory:

    npm run start

This will run the application at [http://localhost:8080](http://localhost:8080)

### Run API Gateway Locally
Earthdata Search utilizes the [Serverless Framework](https://serverless.com/) for managing AWS resources. In order to fully run and manage the application you'll need to install it:

    npm install -g serverless

Certain endpoints require the use of AWS API Gateway and Lambda, to avoid using live environments you should run Serverless Offline to mimic that functionality.

This offline functionality relies on built assets, in order to build the assets for serverless run:

    npm run build-serverless

Once the build successfully completes, start serverless offline:

    serverless offline

This will provide access to API Gateway at [http://localhost:3001](http://localhost:3001)

