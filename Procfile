web: ./start.sh
default_jobs: bundle exec bin/delayed_job --queue=default run
legacy_services_jobs: bundle exec bin/delayed_job --queue=legacy_services run
cron: ./cron.sh
on_build: bundle exec rake deploy:pre