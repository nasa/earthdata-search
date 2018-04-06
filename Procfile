web: ./start.sh
normal_jobs: bundle exec bin/delayed_job --pool=Default:2 run
nsidc_jobs: bundle exec bin/delayed_job --pool=NSIDC run
lpdaac_jobs: bundle exec bin/delayed_job --pool=LPDAAC run
cron: ./cron.sh
on_build: bundle exec rake deploy:pre
