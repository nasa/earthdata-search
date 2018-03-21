module Ous
  # Register custom middleware
  Faraday.register_middleware(:response,
                              logging: Ous::ClientMiddleware::LoggingMiddleware,
                              errors: Ous::ClientMiddleware::ErrorsMiddleware)

  class BaseClient
    def connection
      @connection ||= build_connection
    end

    def initialize(root)
      @root = root
    end

    protected

    def default_headers
      {}
    end

    def request(method, url, params, body, headers, options)
      faraday_response = connection.send(method, url, params) do |req|
        req.headers['Content-Type'] = 'application/json'
        default_headers.each do |header, value|
          req.headers[header] = value
        end
        headers.each do |header, value|
          req.headers[header] = value
        end
        options.each do |opt, value|
          req.options[opt] = value
        end
        req.body = body if body
      end
      
      Ous::Response.new(faraday_response)
    end

    def get(url, params={}, headers={}, options={})
      request(:get, url, params, nil, headers, options)
    end

    def delete(url, params={}, body=nil, headers={}, options={})
      request(:delete, url, params, body, headers, options)
    end

    def post(url, body, headers={}, options={})
      request(:post, url, nil, body, headers, options)
    end

    def put(url, body, headers={}, options={})
      request(:put, url, nil, body, headers, options)
    end

    def build_connection
      Faraday.new(url: @root) do |connection|
        connection.response :logging

        # The order of these handlers is important.  They are run last to first.
        # Our parsers depend on JSON / XML being converted to objects by earlier
        # parsers.
        connection.response :errors, content_type: /\bjson$/
        connection.response :json, content_type: /\bjson$/
        connection.response :xml, content_type: /\bxml$/

        yield(connection) if block_given?

        connection.adapter Faraday.default_adapter
      end
    end
  end
end
