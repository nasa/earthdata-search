require 'faraday_middleware/response_middleware'

# Transform catalog-rest errors into something more understandable
module Echo
  module ClientMiddleware
    class ErrorsMiddleware < FaradayMiddleware::ResponseMiddleware
      def process_response(env)
        # Placeholder.  Not currently needed but will be soon.
        env
      end

      def parse_response?(env)
        body = env[:body]
        body.is_a?(Hash) && body['errors']
      end
    end
  end
end
