module Ous
  # Wraps a Faraday::Response object with helper methods and methods specific to
  # interpreting OUS responses
  class Response
    def initialize(faraday_response)
      @response = faraday_response
    end

    def error?
      status >= 400 || (body.is_a?(Hash) && body.fetch('agentResponse', {}).fetch('requestStatus', {}) == 'failed')
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
