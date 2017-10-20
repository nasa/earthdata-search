#!/bin/bash
bundle exec rake assets:precompile
bundle exec unicorn -E $RAILS_ENV -c config/unicorn.rb