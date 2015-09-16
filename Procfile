web: env RAILS_ENV=production env PORT=$PORT bundle exec unicorn -E production -c config/unicorn.rb
jobs: env RAILS_ENV=production bundle exec bin/delayed_job run
