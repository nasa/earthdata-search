#!/bin/bash
bundle exec bin/delayed_job start

bundle exec whenever --update-crontab

cron -f