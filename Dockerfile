FROM ruby:2.2.2

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev postgresql-client
RUN apt-get install -y qt5-default libqt5webkit5-dev gstreamer1.0-plugins-base gstreamer1.0-tools gstreamer1.0-x npm cron

# Copy the Rails application into place
COPY . /earthdata-search
WORKDIR /earthdata-search

COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock

# Finish establishing Ruby environment
RUN gem install bundler
RUN bundle install
RUN mkdir -p /earthdata-search/tmp
RUN chmod 755 /earthdata-search/tmp

RUN chmod +x ./start.sh
RUN chmod +x ./jobs.sh

# Assets compilation requires a database connection in Rails 4+ which we don't have while
# building our Docker image, we use a gem to fake it
# http://blog.zeit.io/use-a-fake-db-adapter-to-play-nice-with-rails-assets-precompilation/
RUN DB_ADAPTER=nulldb bundle exec rake assets:precompile

CMD rails s -b 0.0.0.0