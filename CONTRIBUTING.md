# Making Changes

Thanks for contributing!

To allow us to incorporate your changes, please use the following process:

1. Fork this repository to your personal account.
2. Create a branch and make your changes.
3. Test the changes locally/in your personal fork.
4. Submit a pull request to open a discussion about your proposed changes.
5. The maintainers will talk with you about it and decide to merge or request additional changes.

Below are specific guidelines for contributing to Earthdata Search.
For general tips on open source contributions, see [Contributing to Open Source on GitHub](https://guides.github.com/activities/contributing-to-open-source/).

# General Contribution Guidelines

## Be Consistent

Please ensure that source code, file structure, and visual design
do not break existing conventions without compelling reasons.

For CSS, we follow [SMACSS](http://smacss.com/book) and the
[CSS Lint rules](https://github.com/stubbornella/csslint/wiki/Rules).

For CoffeeScript, we follow
[polarmobile's CoffeeScript style guide](https://github.com/polarmobile/coffeescript-style-guide)

## Test, and Don't Break Tests

Add tests for new work to ensure changes work and that future changes
do not break them. Run the test suite to ensure that new changes have
not broken existing features. Ensure that tests pass regardless
of timing or execution order.

We use RSpec and Jasmine for our tests. We have structured our tests
so that they can describe our system behavior in a meaningful way
with minimal effort. For all tests, but especially integration tests,
please try to form meaningful sentences when reading a path of
`describe`s, `context`s, and `it`s. For example:

    describe "Account creation" do
      …
      context "for users providing valid information" do
        it "displays a success message" { … }
        it "sends an email to the user" { … }
      end
      context "for users providing duplicate user names" do
        it "displays an informative error message" { … }
        it "prompts users to recover their passwords" { … }
      end
    end

Consider the sentences produced by the above:

  1. Account creation for users providing valid information displays a success message.
  2. Account creation for users providing valid information sends an email to the user.
  3. Account creation for users providing duplicate user names displays an informative error message.
  4. Account creation for users providing duplicate user names prompts users to recover their passwords.

The above sentences describe the behavior of the system given varying inputs in a way that is
readable to non-developers.

## Keep Tests Fast

Our full test suite runs in about 30 minutes, which if anything is higher than ideal.
We prefer testing at the integration level and ensure the test suite remains fast by
mocking external service calls and avoiding unnececessary page loads in our specs.

Please test thoroughly, but follow this pattern to ensure that new tests do not
adversely affect the overall performance of the test suite.

# Code structure

Our code generally follows Ruby on Rails conventions. The descriptions below
describe useful conventions not outlined by Rails; they touch on the most
important pieces of code and do not attempt to describe every directory.

  * `app/`
    * `assets/`
      * `javascripts/`
        * `config.js.coffee.erb` The only place we keep per-environment configuration in JavaScript
        * `util/` Domain-agnostic utility methods which may be generally useful for any JavaScript application
        * `modules/` Non-knockout components or customizations developed for Earthdata Search
          * `maps/` Leaflet.js customizations
          * `timeline/` Granule timeline implementation
        * `models/` Knockout.js models, cusomizations, and base classes
          * `data/` Models for data items such as datasets and granules, separate from UI concerns
          * `ui/` Models for UI elements, containing click handlers and tracking UI state
          * `page/` Models for aggregating the UI and data models into a complete page state
    * `services/` Interfaces with 3rd party services
  * `lib/`
    * `echo/` client code for interfacing with ECHO and the CMR, meant to be a thin wrapper able to be separated as a gem
    * `vcr/` customizations to the [VCR](https://github.com/vcr/vcr/) fixture library which configure fixture files, improve performance, and limit the number of merge conflicts we deal with in our fixtures.
  * `spec/` Test suite
    * `features/` Capybara specs
    * `javascripts/` Jasmine specs
  * `doc/ui/` UI documentation (pattern portfolio)

# Dependencies

Earthdata Search is implemented primarily using Ruby on Rails 4 running on
Ruby 2 (MRI).

Production instances run on unicorn / nginx and are backed by a Postgres
database.

Earthdata Search is primarily a client to numerous web-facing services:

  * CMR: Metadata search, browse imagery, and data ordering
  * DAAC-hosted OPeNDAP: Data acquisition and subsetting
  * GIBS: Tiled imagery for granule visualizations
  * Earthdata Login: User authentication
  * ogre.adc4gis.com: Shapefile to GeoJSON conversion (to be replaced by self-hosted instance once we can stand up a node.js server)

Client-side code is written in CoffeeScript, and uses jQuery or plain
JavaScript for DOM interaction.

We use [knockout.js](http://knockoutjs.com/) for handling data models and
keeping the interface in sync with changing data.

We use [Leaflet.js](http://leafletjs.com/) to draw our
maps and [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw) to allow the
user to draw and edit spatial bounds. We have customized our maps to handle
projection switches, rendering of GIBS-based layers for a set of granule
results, and translation / interpolation of ECHO polygons into Leaflet-
compatible geometries. Customizations are located in the
app/assets/javascripts/modules/maps directory

We use a custom version of Bootstrap for some UI elements. Our customized
version of bootstrap can be downloaded
[here](http://getbootstrap.com/customize/?id=f643605a9951678cdcbe).

See public/licenses.txt for a comprehensive list of dependencies.

# Testing

Fast and consistent tests are critical. The full suite should run in under 30
minutes and faster is better. Please ensure tests run quickly and pass
consistently regardless of execution order.

The entire suite of Earthdata Search tests, including unit, functional, and
integration tests, may be run using the `rake test` command. Earthdata Search
uses RSpec and Jasmine for its tests.

Integration specs use Capybara and Selenium to simulate browser
interactions. We include the capybara-screenshot gem and publish screenshots
produced by failing builds to aid debugging.

In order to ensure speed and consistency in our integration specs, we
have mocked all of our external service calls using VCR and customized
Capybara to avoid reloading sessions between every spec (generally this
means you want to use `before(:all)` instead of `before(:each)` in specs
and ensure that there is a corresponding `after(:all)` block that resets
the page state.

We document the application's behavior using our RSpec integration specs. To
generate this documentation, run `rspec spec/features/ --format=documentation
-o doc/specs.html`. Generated documentation will appear in doc/specs.html.

In order to allow us to describe the application behavior using RSpec,
developers must read and follow the guidelines in the "Testing" section of
this document's style guide.

For testing JavaScript, we use Jasmine, which has an RSpec-like syntax.
Developers should exercise their JavaScript in the same way they exercise Ruby
code. Jasmine tests are located under spec/javascripts. They can be run
continuously using `rake jasmine` or once using `rake jasmine:ci`.

## The Pattern Portfolio for HTML, CSS, and JavaScript testing

In addition to the RSpec and Jasmine tests documented in the previous section,
we perform additional tests to ensure that our UI looks and functions as
intended.

Reusable CSS rules and JavaScript components should be displayed in the
project's pattern portfolio document found at docs/ui/index.html. Developers
may add to the portfolio by editing docs/ui/templates/index.html.erb. We
generate the portfolio by running `rake doc:ui` in the project root (or `rake
doc` to generate all project documentation).

To see which rules are demonstrated, we run Deadweight on the pattern
portfolio to scan for unused rules using `rake test:deadweight`.

To ensure the quality of our CSS, we run CSS lint using `rake test:csslint`.
Developers are encouraged to read the CSS Lint wiki
(<https://github.com/stubbornella/csslint/wiki/Rules>) to learn about the
reasoning behind the rules.

# License

Earthdata Search is licensed under an Apache 2.0 license as described in
the LICENSE file at the root of the project:

> Copyright © 2007-2014 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>     http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

By submitting a pull request, you are agreeing to allow distribution
of your work under the above copyright and license.
