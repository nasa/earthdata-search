#!/bin/bash
bundle exec whenever --update-crontab
bundle exec bin/delayed_job run

cron -f