web: ./start.sh
normal_jobs: bundle exec bin/delayed_job --pool=Default:2 --pool=*:2 run
priority_jobs: bundle exec bin/delayed_job --pool=NSIDC --pool=LPDAAC --pool=*:2 run
cron: ./cron.sh
on_build: bundle exec rake deploy:pre
