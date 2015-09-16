require 'colormaps/xml_to_json'

namespace :colormaps do
  desc "Load colormap data from GIBS"
  task :load do
    error_count = Colormaps.load
    exit 1 if error_count > 0
  end
end

Rake::Task['db:seed'].enhance ['colormaps:load']
