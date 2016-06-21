require 'faraday_middleware/response_middleware'

module Echo
  module ClientMiddleware
    class Echo10CollectionMiddleware < FaradayMiddleware::ResponseMiddleware
      def process_response(env)
        body = Array.wrap(env[:body]['Collection'])
        env[:body] = body.map do |collection_xml|
          collection = Collection.new
          collection.xml = collection_xml
          collection
        end

        env[:summary] = "#{env[:body].size} echo10/xml collections"
      end

      def parse_response?(env)
        body = env[:body]
        body.is_a?(Hash) && body['Collection']
      end
    end
  end
end
