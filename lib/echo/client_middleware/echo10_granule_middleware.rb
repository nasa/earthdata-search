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
          xml.gsub!("<Granule>\n", '') # Remove top level element
          xml.gsub!(/<(\w+)>/, '\1: ') # Remove '<>' from around opening brackets and add ': '
          xml.gsub!(/<\/\w+>/, '') # Remove all closing brackets
          xml.gsub!(/^\s*$\n/, '') # Remove empty lines
          xml.gsub!(/^\s*<\w+\s+\w+="\w+"(|\/)>$\n/, '') # Remove empty elements with attributes

          granule.xml = xml
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
