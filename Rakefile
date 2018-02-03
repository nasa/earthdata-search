#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

# [EDSC-1435] Vulnerabilities required an update to some gems, one of
# which updated Rake. Rake no longer uses last_comment, instead it uses
# last_description. Unfortunatley rspec calls that method we are currently
# unable to update rspec due to the changes required if we do so. This
# will override that method for now and return the new method from rake.
# 
# -- https://stackoverflow.com/a/35893941/262983
# 
# NOTE: Downgrading the gem back to 11.2.2 will remove the requirement
# for this workaround, but it will still throw a deprecation warning. I'd
# rather update Rake and deal with a workaround. 
module TempFixForRakeLastComment
  def last_comment
    last_description
  end
end
Rake::Application.send :include, TempFixForRakeLastComment

EarthdataSearchClient::Application.load_tasks

namespace :db do

  desc 'Setup a local database.yml file'
  task :local_setup do
    application_dir = File.dirname(__FILE__)
    cp "#{application_dir}/config/database.yml.example", "#{application_dir}/config/database.yml"
  end
end


Knapsack.load_tasks if defined?(Knapsack)
