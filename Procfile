web: ./start.sh
normal_jobs: bundle exec bin/delayed_job --pool=Default --pool=*:2 start
priority_jobs: bundle exec bin/delayed_job --pool=NSIDC --pool=LPDAAC  start
cron: ./cron.sh
on_build: bundle exec rake deploy:pre
