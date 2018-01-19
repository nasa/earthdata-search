#!/bin/bash
bundle exec unicorn -E $RAILS_ENV -c config/unicorn.rb