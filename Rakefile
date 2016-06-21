#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

EarthdataSearchClient::Application.load_tasks

namespace :db do

  desc 'Setup a local database.yml file'
  task :local_setup do
    application_dir = File.dirname(__FILE__)
    cp "#{application_dir}/config/database.yml.example", "#{application_dir}/config/database.yml"
  end
end


Knapsack.load_tasks if defined?(Knapsack)
