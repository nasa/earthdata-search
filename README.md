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

* Ruby 2.1.2
* Bundler (`gem install bundler`)
* [Pow](http://pow.cx/) is recommended for local testing with URS
* A Ruby manager such as [RVM](http://rvm.io/) or [rbenv](https://github.com/sstephenson/rbenv) is strongly recommended.
* (For shapefile support) access to an [ogre](http://ogre.adc4gis.com) server
* (For placename completion) a [GeoNames](http://www.geonames.org) account

### URS Configuration

If you would like to set up URS login, you will need to perform the following steps:

Register an account on [the URS home page](https://urs.earthdata.nasa.gov/profile)

Create an application in the URS console.  Its callback URL should be `http://<domain>/urs_callback`.  If you are using Pow, this will be something
like `http://earthdata-search.dev/urs_callback`

Click the "Feedback" icon on the URS page and request that your new application be placed in the ECHO application group
(required for ECHO/CMR to recognize your tokens).

Modify line 37 of `config/services.yml` to contain your URS application's client ID

### Application configuration

If using Pow, create a symlink to your application directory, for instance `ln -s $(pwd) ~/.pow/earthdata-search`
(making your app available at `http://earthdata-search.dev`).  If you set up URS, ensure that the domain matches
the callback URL specified in URS.

Run `cp config/application.yml.example config/application.yml`

Open `config/application.yml` and edit configuration values as described in that file to set up URS, shapefile support,
and placename completion as appropriate.

### Initial setup

Run
    bundle install
    rake db:migrate
    rake db:seed

### Running

If you set up Pow, simply visit `http://earthdata-search.dev`,
otherwise run `rails s` in the project directory and visit `http://localhost:3000`.
