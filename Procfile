web: env RAILS_ENV=$RAILS_ENV env PORT=$PORT bundle exec unicorn -E $RAILS_ENV -c config/unicorn.rb
jobs: env RAILS_ENV=$RAILS_ENV bundle exec bin/delayed_job run

# The lines below should be used when SearchLab is ready to go to NGAP 1.1
# web: ./start.sh
# jobs: bundle exec bin/delayed_job run
# on_build: bundle exec rake deploy:pre
