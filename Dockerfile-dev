FROM ruby:2.5.1
# Install dependencies
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
RUN echo "deb [arch=amd64]  http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev postgresql-client nodejs unzip google-chrome-stable

# Install chromedriver
RUN wget https://chromedriver.storage.googleapis.com/2.44/chromedriver_linux64.zip
RUN unzip chromedriver_linux64.zip
RUN mv chromedriver /usr/local/bin/chromedriver
RUN chown root:root /usr/local/bin/chromedriver
RUN chmod 0755 /usr/local/bin/chromedriver

ENV APP_HOME /earthdata-search
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY Gemfile* $APP_HOME/
COPY package*.json $APP_HOME/

RUN bundle install
RUN npm install

COPY . $APP_HOME
EXPOSE 3000
CMD bundle exec rails s -p 3000 -b '0.0.0.0'
