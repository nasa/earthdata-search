require 'rake'

CONFIG_DIR       = "config"
BAMBOO_FILES_DIR = "config"
DATABASE_YML     = "#{CONFIG_DIR}/database.yml"

namespace :bamboo do

  desc "Clean up the Bamboo files used by the prepare task"
  task :clean do
    File.delete(DATABASE_YML) if File.exist?(DATABASE_YML)
  end

  desc "Prepare the project for building in the Atlassian Bamboo environment"
  task :prepare => :clean do
    cp File.join(BAMBOO_FILES_DIR, "database.yml.bamboo"),
       File.join(CONFIG_DIR, "database.yml"),
       :verbose => true
  end
end
