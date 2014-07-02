require "rexml/document"
require 'faraday_middleware/response_middleware'

module Echo
  module ClientMiddleware
    class Echo10GranuleMiddleware < FaradayMiddleware::ResponseMiddleware
      def process_response(env)
        body = env[:body]

        if body['Granule']
          granule_xmls = Array.wrap(body['Granule'])
        elsif body['results']
          granule_xmls = Array.wrap(body['results']['result'])
        else
          granule_xmls = []
        end

        env[:body] = granule_xmls.map do |granule_xml|
          granule = Granule.new
          granule.browse_urls = parse_browse_urls(granule_xml)
          xml = granule_xml.to_xml(:root => 'Granule', :skip_instruct => true, :indent => 2)
          xml.gsub!(/<(\w+)>/, '\1: ') # Remove '<>' from around opening brackets and add ': '
          xml.gsub!(/<\/\w+>/, '') # Remove all closing brackets
          xml.gsub!(/^\s*$\n/, '') # Remove empty lines
          # xml.gsub!(/^\s*\w+:\s*$\n/, '') # Remove empty elements
          # xml.gsub!(/^\s*<\w+\s+\w+="\w+"\/>$\n/, '') # Remove empty elements with attributes


          granule.xml = xml
          puts granule.xml.inspect
          # granule.granule_ur = granule_xml['GranuleUR']
          # granule.insert_time = granule_xml['InsertTime']
          # granule.last_update = granule_xml['LastUpdate']
          # granule.dataset_id = granule_xml['Collection']['DataSetId'] if granule_xml['Collection']
          # if granule_xml['DataGranule']
          #   granule.size_mb = granule_xml['DataGranule']['SizeMBDataGranule']
          #   granule.day_night_flag = granule_xml['DataGranule']['DayNightFlag']
          #   granule.production_date = granule_xml['DataGranule']['ProductionDateTime']
          # end
          # granule.temporal = granule_xml['Temporal']
          # granule.spatial = Array.wrap(granule_xml['Spatial'])
          # granule.orbit_calculated_spatial_domains = granule_xml['OrbitCalculatedSpatialDomains']
          # # granule.measured_parameters = granule_xml['MeasuredParameters']
          # granule.platforms = Array.wrap(granule_xml['Platforms'])
          # granule.campaigns = Array.wrap(granule_xml['Campaigns'])
          # granule.additional_attributes = Array.wrap(granule_xml['AdditionalAttributes'])
          # granule.input_granules = Array.wrap(granule_xml['InputGranules'])
          # granule.price = granule_xml['Price']
          # if granule_xml['OnlineAccessURLs']
          #   granule.online_access_urls = Array.wrap(granule_xml['OnlineAccessURLs']['OnlineAccessURL'])
          # else
          #   granule.online_access_urls = []
          # end
          # if granule_xml['OnlineResources']
          #   granule.online_resources = Array.wrap(granule_xml['OnlineResources']['OnlineResource'])
          # else
          #   granule.online_resources = []
          # end
          # granule.orderable = granule_xml['Orderable']
          # granule.data_format = granule_xml['DataFormat']
          # granule.visible = granule_xml['Visible']
          granule
        end

        env[:summary] = "#{env[:body].size} echo10/xml granules"
      end

      def parse_response?(env)
        status = env[:response].status
        env[:url].path.include?('granules') && status >= 200 && status < 300
      end

      private

      def parse_browse_urls(xml)
        browse_urls = []
        if xml['AssociatedBrowseImageUrls']
          products = Array.wrap(xml['AssociatedBrowseImageUrls']['ProviderBrowseUrl'])
          browse_urls += products.map { |p| p['URL'] }
        end

        browse_urls
      end
    end
  end
end
