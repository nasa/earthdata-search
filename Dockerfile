FROM ruby:2.2.2

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev postgresql-client

# Install dependencies
RUN apt-get install -y qt5-default libqt5webkit5-dev gstreamer1.0-plugins-base gstreamer1.0-tools gstreamer1.0-x

# Define where our application will live inside the image
ENV RAILS_ROOT /var/www/edsc

# Create application home
RUN mkdir -p $RAILS_ROOT/tmp/pids

# Set our working directory inside the image
WORKDIR /app

COPY Gemfile Gemfile

COPY Gemfile.lock Gemfile.lock


RUN gem install bundler

# Finish establishing our Ruby enviornment
RUN bundle install

# Copy the Rails application into place
COPY . /app

#CMD env RAILS_ENV=$RAILS_ENV env PORT=$PORT bundle exec unicorn -E $RAILS_ENV -c config/unicorn.rb
CMD rails s -b 0.0.0.0