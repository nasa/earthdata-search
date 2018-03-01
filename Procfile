web: ./start.sh
jobs: bundle exec bin/delayed_job --pool=Default:2 --pool=NSIDC,LPDAAC:2 --pool=*:2 run
cron: ./cron.sh
on_build: bundle exec rake deploy:pre
