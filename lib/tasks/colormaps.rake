require 'colormaps/xml_to_json'
require 'socket'

namespace :colormaps do
  desc "Load colormap data from GIBS"
  task :load do
    error_count = Colormaps.load
    if error_count > 0
      job = CronJobHistory.new(task_name: 'colormaps:load', last_run: Time.now, status: 'failed', message: "#{error_count} error(s), #{file_count} file(s)", host: Socket.gethostname)
      job.save!
      exit 1
    else
      job = CronJobHistory.new(task_name: 'colormaps:load', last_run: Time.now, status: 'succeeded', host: Socket.gethostname)
      job.save!
    end
  end
end

Rake::Task['db:seed'].enhance ['colormaps:load']
