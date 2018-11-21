# [Earthdata Search](https://search.earthdata.nasa.gov)

Visit Earthdata Search at
[https://search.earthdata.nasa.gov](https://search.earthdata.nasa.gov)

[![Build Status](https://travis-ci.org/nasa/earthdata-search.svg?branch=master)](https://travis-ci.org/nasa/earthdata-search)

## About
Earthdata Search is a web application developed by [NASA](http://nasa.gov) [EOSDIS](https://earthdata.nasa.gov)
to enable data discovery, search, comparison, visualization, and access across EOSDIS' Earth Science data holdings.
It builds upon several public-facing services provided by EOSDIS, including
the [Common Metadata Repository (CMR)](https://cmr.earthdata.nasa.gov/search/) for data discovery and access,
EOSDIS [User Registration System (URS)](https://urs.earthdata.nasa.gov) authentication,
the [Global Imagery Browse Services (GIBS)](https://earthdata.nasa.gov/gibs) for visualization,
and a number of OPeNDAP services hosted by data providers.

## Components

In addition to the main project, we have open sourced stand-alone components built for
Earthdata Search as separate projects with the "edsc-" (Earthdata Search components) prefix.

 * Our timeline: https://github.com/nasa/edsc-timeline
 * Our ECHO forms implementation: https://github.com/nasa/edsc-echoforms

## License

> Copyright © 2007-2014 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>    http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Third-Party Licenses

See public/licenses.txt

## Installation

### Prerequisites
* [Ruby](https://www.ruby-lang.org)
* [Docker](https://docs.docker.com/install/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* (For shapefile support) access to an [ogre](http://ogre.adc4gis.com) server
* (Optional) For automatic spatial and temporal extraction from the search text, clone and set up an [EDSC-NLP](https://git.earthdata.nasa.gov/projects/EDSC/repos/edsc-nlp/browse) server

### Initial setup

Run

    bin/setup

Note: This command will take a long time to run

### Application configuration

Review `config/application.yml` and update values as necessary

#### (Optional) Earthdata Login (URS) Configuration

Without the Earthdata Login Configuration, Earthdata Search's functionality will be limited. If you would like to set up Earthdata Login login, you will need to perform the following steps:

Register an account on [the Earthdata Login home page](https://urs.earthdata.nasa.gov/home).

Create an application in the Earthdata Login console.  Its callback URL should be `http://<domain>/urs_callback`.  Standard Rails development would be `http://localhost:3000/urs_callback`.

Click the "Feedback" icon on the Earthdata Login page and request that your new application be placed in the ECHO application group
(required for ECHO/CMR to recognize your tokens).

Your Earthdata Login application's client ID will need to be saved in `config/application.yml`.

### Running

Run

    docker-compose up

Then visit http://localhost:3000/

### Running tests

    docker-compose run web bundle exec rspec

### Terminal Access

If you want terminal access to inside the container, run

    docker-compose run web bash
