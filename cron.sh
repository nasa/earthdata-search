#!/bin/bash
bundle exec whenever --update-crontab

cron -f
