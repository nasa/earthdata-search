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
          granule.xml = granule_xml
          granule
        end

        env[:summary] = "#{env[:body].size} echo10/xml granules"
      end

      def parse_response?(env)
        body = env[:body]
        body.is_a?(Hash) && body['Granule']
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
