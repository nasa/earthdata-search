FROM ruby:2.2.2

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev postgresql-client

# Install dependencies
RUN apt-get install -y qt5-default libqt5webkit5-dev gstreamer1.0-plugins-base gstreamer1.0-tools gstreamer1.0-x

RUN mkdir /app
WORKDIR /app

COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock

RUN gem install bundler

# Finish establishing Ruby environment
RUN bundle install

# Copy the Rails application into place
COPY . /app

CMD rails s -b 0.0.0.0