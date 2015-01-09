require 'nokogiri'
require 'open-uri'
require 'json'

def str_to_hex(str)
  str.to_i.to_s(16).rjust(2, "0")
end

namespace :colormaps do
  desc "Load colormap data from GIBS"
  task :load do
    puts "Loading GIBS colormap data..."
    output_dir = "#{Rails.root}/public/colormaps"
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
        begin
          file_count += 1

          xml_file = open(url).read
          xml = Nokogiri::XML(xml_file)

          scale_colors = []
          scale_labels = []
          scale_values = []
          class_colors = []
          class_labels = []
          special_colors = []
          special_labels = []

          entries = xml.xpath("//ColorMap/ColorMapEntry")

          entries.each do |entry|
            r,g,b = entry.attribute("rgb").to_s.split(',')
            a = 255
            a = 0 if entry.attribute("transparent") && entry.attribute("transparent") == "true"
            color = "#{str_to_hex(r)}#{str_to_hex(g)}#{str_to_hex(b)}#{str_to_hex(a)}"
            label = entry.attribute("label")
            if a == 0
              special_colors << color
              special_labels << label
            elsif entry.attribute("value")
              items = entry.attribute("value").to_s.gsub(/[\(\)\[\]]/, "").split(",")
              begin
                items.each do |scale_value|
                  v = scale_value.to_f
                  if v == Float::INFINITY
                    v = Float::MAX
                  end
                  if v == -Float::INFINITY
                    v = Float::MIN
                  end
                  scale_values << v
                end
              rescue ValueError => e
                raise "Invalid value: {entry.attribute('value').to_s}"
              end
              scale_colors << color
              scale_labels << label
            else
              class_colors << color
              class_labels << label
            end
          end

          data = Hash.new
          if scale_colors.size > 0
            data["scale"] = Hash.new
            data["scale"]["colors"] = scale_colors
            data["scale"]["values"] = scale_values
            data["scale"]["labels"] = scale_labels
          end
          if special_colors.size > 0
            data["special"] = Hash.new
            data["special"]["colors"] = special_colors
            data["special"]["labels"] = special_labels
          end
          if class_colors.size > 0
            data["classes"] = Hash.new
            data["classes"]["colors"] = class_colors
            data["classes"]["labels"] = class_labels
          end
          data["id"] = id

          output_file = File.join(output_dir, id + ".json")
          File.open(output_file, "w") do |f|
            f.write(data.to_json)
          end

        rescue Exception => e
          puts "Error: #{e.backtrace}"
          error_count += 1
        end
      end
    end

    puts "#{error_count} error(s), #{file_count} file(s)"

    exit 1 if error_count > 0

  end
end
