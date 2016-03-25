Faraday.register_middleware(:response,
                            :logging => Echo::ClientMiddleware::LoggingMiddleware)

class CwicController < ApplicationController
  # This controller essentially passes all requests straight through to CWIC and only
  # does processing to log the request and response time
  def index
    path = request.fullpath.gsub(/^\/cwic/, '')
    cwic_response = build_raw_client.send(request.method.downcase, path)
    render xml: cwic_response.body, status: cwic_response.status
  end

  def download
    @url = request.fullpath.gsub(/^\/cwic\/edsc_download\//, root)
    render content_type: 'text/html', layout: false
  end

  def granule
    path = URI.decode(request.fullpath.gsub(/\/cwic\/edsc_granule\//,''))
    cwic_response = build_raw_client.send(request.method.downcase, path)
    render xml: cwic_response.body, status: cwic_response.status
  end

  private

  def build_raw_client
    Faraday.new(:url => root) do |conn|
      conn.response :logging
      conn.adapter Faraday.default_adapter
    end
  end

  def root
    Rails.configuration.services['cwic_root']
  end
end
