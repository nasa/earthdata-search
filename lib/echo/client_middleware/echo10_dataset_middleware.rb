require 'faraday_middleware/response_middleware'

module Echo
  module ClientMiddleware
    class Echo10DatasetMiddleware < FaradayMiddleware::ResponseMiddleware
      def process_response(env)
        body = Array.wrap(env[:body]['Collection'])
        env[:body] = body.map do |dataset_xml|
          dataset = Dataset.new
          dataset.xml = dataset_xml
          dataset
        end

        env[:summary] = "#{env[:body].size} echo10/xml datasets"
      end

      def parse_response?(env)
        body = env[:body]
        body.is_a?(Hash) && body['Collection'] || body.is_a?(Array) && body.first == 'Collection'
      end
    end
  end
end
