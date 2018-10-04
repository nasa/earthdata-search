FROM ruby:2.5.1

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev postgresql-client

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

RUN apt-get install -y qt5-default libqt5webkit5-dev gstreamer1.0-plugins-base gstreamer1.0-tools gstreamer1.0-x cron

ENV APP_HOME /earthdata-search
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY Gemfile* $APP_HOME/

# Finish establishing Ruby environment
RUN gem install bundler
RUN bundle install

#Copy in the app source after running `bundle Install` so that we can use the cache unless contents of Gemfile* change
COPY . $APP_HOME
RUN mkdir -p ./tmp
RUN chmod 755 ./tmp

RUN chmod +x ./start.sh
RUN chmod +x ./cron.sh

# Run asset precompile with a fake database URL(since we do not have the real DB_URL at build time and dont really need it to compile assets)
RUN RAILS_ENV=production skip_node_compile=true DATABASE_URL=postgres://user:password@host:1111/db-name bundle exec rake assets:precompile

CMD rails s -b 0.0.0.0
