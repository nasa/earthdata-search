require 'nokogiri'
require 'open-uri'
require 'json'
require 'colormaps/xml_to_json'


namespace :colormaps do
  desc "Load colormap data from GIBS"
  task :load do
    puts "Loading GIBS colormap data..."
    output_dir = "#{Rails.root}/public/colormaps"
    FileUtils::mkdir_p(output_dir)
    gibs_url = "http://map1a.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi/?SERVICE=WMTS&REQUEST=GetCapabilities"

    file_count = 0
    error_count = 0

    capabilities_str = open(gibs_url).read
    # This xmlns was breaking xpath queries
    capabilities_file = Nokogiri::XML(capabilities_str.sub('xmlns="http://www.opengis.net/wmts/1.0"', ''))

    layers = capabilities_file.xpath("/Capabilities/Contents/Layer")
    layers.each do |layer|
      id = layer.xpath("./ows:Identifier").first.content.to_s
      url = layer.xpath("./ows:Metadata/@xlink:href").to_s

      unless id.empty? || url.empty?
        file_count += 1
        result = Colormaps.xml_to_json(id, url, output_dir)
        error_count += 1 unless result
      end
    end

    puts "#{error_count} error(s), #{file_count} file(s)"

    exit 1 if error_count > 0

    # explicitly invoke the task here to make sure task colormaps:load completes successfully.
    Rake::Task['colormaps:log_colormaps_load'].invoke

  end

  desc "Record the last run of task 'colormaps:load' by touching a file in ./tmp dir"
  task :log_colormaps_load do
    Dir.glob(Rails.root.join('tmp', "colormaps_load_*")).each do |f|
      File.delete(f)
    end

    FileUtils.touch Rails.root.join('tmp', "colormaps_load_#{Time.now.to_i}")
  end
end

Rake::Task['db:seed'].enhance ['colormaps:load']
