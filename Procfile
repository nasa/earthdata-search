web: env RAILS_ENV=$RAILS_ENV env PORT=$PORT bundle exec unicorn -E $RAILS_ENV -c config/unicorn.rb
jobs: env RAILS_ENV=$RAILS_ENV bundle exec bin/delayed_job run
