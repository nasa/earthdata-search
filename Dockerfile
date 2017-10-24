FROM ruby:2.2.2

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev postgresql-client
RUN apt-get install -y qt5-default libqt5webkit5-dev gstreamer1.0-plugins-base gstreamer1.0-tools gstreamer1.0-x npm

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

CMD rails s -b 0.0.0.0