web: ./start.sh
normal_jobs: bundle exec bin/delayed_job --pool=Default run
nsidc_jobs: bundle exec bin/delayed_job --pool=NSIDC run
lpdaac_jobs: bundle exec bin/delayed_job --pool=LPDAAC run
worker: bundle exec rake jobs:work
cron: ./cron.sh
on_build: bundle exec rake deploy:pre
