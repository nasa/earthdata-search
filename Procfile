web: ./start.sh
normal_jobs: bundle exec bin/delayed_job --pool=default run
nsidc_jobs: bundle exec bin/delayed_job --pool=nsidc run
lpdaac_jobs: bundle exec bin/delayed_job --pool=lpdaac run
worker: bundle exec rake jobs:work
cron: ./cron.sh
on_build: bundle exec rake deploy:pre
