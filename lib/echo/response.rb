module Echo
  # Wraps a Faraday::Response object with helper methods and methods specific to
  # interpreting ECHO responses
  class Response
    def initialize(faradayResponse)
      @response = faradayResponse
    end

    def error?
      status >= 400 || (body.is_a?(Hash) && body['errors'])
    end

    def success?
      !error?
    end

    def faraday_response
      @response
    end

    def body
      @response.body
    end

    def headers
      @response.headers
    end

    def status
      @response.status
    end
  end
end
