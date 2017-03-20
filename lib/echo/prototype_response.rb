module Echo
  class PrototypeResponse
    def initialize(resp)
      @response = resp
    end

    def error?
      status >= 400 || (body.is_a?(Hash) && body['errors'])
    end

    def success?
      !error?
    end

    def prototype_response
      @response
    end

    def body
      if format == 'json' && @response['body'].present?
        JSON.parse @response['body']
      else
        @response['body']
      end
    end

    def headers
      @response['headers']
    end

    def status
      @response['status'].to_i
    end

    def format
      @response['format']
    end
  end
end
