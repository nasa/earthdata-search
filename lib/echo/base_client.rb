module Echo
  # Register custom middleware
  Faraday.register_middleware(:response,
                              :logging => Echo::ClientMiddleware::LoggingMiddleware,
                              :errors => Echo::ClientMiddleware::ErrorsMiddleware,
                              :echo10_datasets => Echo::ClientMiddleware::Echo10DatasetMiddleware,
                              :echo10_granules => Echo::ClientMiddleware::Echo10GranuleMiddleware,
                              :events => Echo::ClientMiddleware::EventMiddleware)

  class BaseClient
    include Echo::QueryTransformations

    def connection
      @connection ||= build_connection
    end

    def initialize(root, client_id)
      @root = root
      @client_id = client_id
    end

    protected

    def token_header(token)
      token.present? ? {'Echo-Token' => "#{token}:#{@client_id}"} : {}
    end

    def request(method, url, params, body, headers)
      faraday_response = connection.send(method, url, params) do |req|
        req.headers['Content-Type'] = 'application/json' unless method == :get
        req.headers['Client-Id'] = Rails.configuration.client_id
        req.headers['Echo-ClientId'] = Rails.configuration.client_id unless self.class == CmrClient
        headers.each do |header, value|
          req.headers[header] = value
        end
        req.body = body if body
      end
      Echo::Response.new(faraday_response)
    end

    def get(url, params={}, headers={})
      request(:get, url, params, nil, headers)
    end

    def delete(url, params={}, headers={})
      request(:delete, url, params, nil, headers)
    end

    def post(url, body, headers={})
      request(:post, url, nil, body, headers)
    end

    def put(url, body, headers={})
      request(:put, url, nil, body, headers)
    end

    def build_connection
      Faraday.new(:url => @root) do |conn|
        conn.response :logging

        # The order of these handlers is important.  They are run last to first.
        # Our parsers depend on JSON / XML being converted to objects by earlier
        # parsers.
        conn.response :errors, :content_type => /\bjson$/
        conn.response :json, :content_type => /\bjson$/
        conn.response :echo10_granules, :content_type => /^application\/(echo10\+)?xml$/
        conn.response :echo10_datasets, :content_type => /^application\/(echo10\+)?xml$/
        conn.response :events, :content_type => /\bxml$/
        conn.response :xml, :content_type => /\bxml$/

        conn.adapter Faraday.default_adapter
      end
    end
  end
end
