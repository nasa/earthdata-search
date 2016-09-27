require 'nokogiri'
require 'open-uri'
require 'json'

module Colormaps

  def self.load
    puts "Loading GIBS colormap data..."
    output_dir = "#{Rails.root}/public/colormaps"
    begin
      # if the directory exists, delete it before running the rake task
      # so old/stale colormaps aren't stored b/c GIBS will be updating versions
      FileUtils::remove_dir(output_dir)
    rescue Errno::ENOENT
      # blank rescue block, in case the directory did not already exist
    end
    FileUtils::mkdir_p(output_dir)

    # regular, OPS url
    gibs_url = "http://map1a.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi/?SERVICE=WMTS&REQUEST=GetCapabilities"
    # SIT url (behind vpn), for testing upgrade to colormaps that have xlink:href role v1.2
    # gibs_url = "https://sit.gibs.earthdata.nasa.gov/wmts/epsg4326/all/wmts.cgi?SERVICE=WMTS&REQUEST=GetCapabilities"

    file_count = 0
    error_count = 0

    capabilities_str = open(gibs_url).read
    # This xmlns was breaking xpath queries
    capabilities_file = Nokogiri::XML(capabilities_str.sub('xmlns="http://www.opengis.net/wmts/1.0"', ''))

    layers = capabilities_file.xpath("/Capabilities/Contents/Layer")
    layers.each do |layer|
      id = layer.xpath("./ows:Identifier").first.content.to_s

      # get v1.2 role metadata node
      target = layer.xpath("./ows:Metadata[contains(@xlink:role, '1.2')]")
      if target.empty?
        # not upgraded yet, layer does not have a metadata node with xlink:role v1.2,
        # so try to use url from another metadata node (no version or v1.0)
        url = layer.xpath("./ows:Metadata/@xlink:href").to_s
      else
        url = target.attribute("href").to_s
      end
      url = url.gsub(/^https/, 'http') # Avoid SSL errors in CI

      unless id.empty? || url.empty? || !url.start_with?('http')
        file_count += 1
        result = Colormaps.xml_to_json(id, url, output_dir)
        error_count += 1 unless result
      end
    end

    puts "#{error_count} error(s), #{file_count} file(s)"

    error_count
  end

    # This method takes a XML formatted GIBS colormap and converts it to JSON format
    # https://github.com/nasa-gibs/worldview/blob/12ac2e188048c1d32a858f68b2eaac85852462d6/bin/wv-options-colormap
    # id: ID found in XML colormap. Used to name JSON file. (MODIS_Terra_Snow_Cover)
    # url: GIBS URL for XML colormap. (http://map1.vis.earthdata.nasa.gov/colormaps/MODIS_Terra_Snow_Cover.xml)
    # output_dir: output directory of the JSON file. (public/colormaps)
    def self.xml_to_json(id, url, output_dir)
      begin
        xml_file = open(url).read
        xml = Nokogiri::XML(xml_file)

        scale_colors = []
        scale_labels = []
        scale_values = []
        class_colors = []
        class_labels = []
        special_colors = []
        special_labels = []

        # Colormaps 1.0
        entries = xml.xpath("//ColorMap/ColorMapEntry")

        if entries.size == 0
          # Colormaps 1.2
          colormaps = xml.xpath("//ColorMaps/ColorMap")

          unless colormaps.find { |map| map.attribute('title').to_s == 'No Data' }.nil?
            blank_colormap = colormaps.find { |cmap| cmap.attribute('title').to_s == 'No Data' && cmap.xpath("./Entries[not(@*)]") }
            colormaps.delete(blank_colormap)
          end
          return if colormaps.nil?

          entries = colormaps.xpath("./Entries/ColorMapEntry")
        end

        entries.each do |entry|
          r,g,b = entry.attribute("rgb").to_s.split(',')
          a = 255
          a = 0 if entry.attribute("transparent") && entry.attribute("transparent") == "true"
          color = "#{str_to_hex(r)}#{str_to_hex(g)}#{str_to_hex(b)}#{str_to_hex(a)}"
          label = entry.attribute("label").value
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

        return true

      rescue Exception => e
        # GIBS-876: GIBS serves up two URLs that are 404.  We need to cope with these.
        error_type = e.message == '404 Not Found' ? 'Warning' : 'Error'
        puts "#{error_type} [#{url}]: #{e.message}"
        return error_type == 'Warning'
      end
    end

    def self.str_to_hex(str)
      str.to_i.to_s(16).rjust(2, "0")
    end
end
