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
    if params['download_format'] == 'text'
      path = request.fullpath.gsub(/^\/cwic\/edsc_download\//, root)
      path = path.gsub(/&download_format=text/, '') if params['download_format'] == 'text'
      cwic_response = build_raw_client.send(request.method.downcase, path)
      datasetId = ((/C\d+-.+/ =~ params['datasetId']) ? params['datasetId'] : 'NO_COLLECTION_ID')
      send_data fetch_links_to_file(cwic_response.body), filename: "#{datasetId}_data_urls.txt"
    else
      @url = request.fullpath.gsub(/^\/cwic\/edsc_download\//, root)
      render content_type: 'text/html', layout: false
    end
  end

  def granule
    path = URI.decode(request.fullpath.gsub(/\/cwic\/edsc_granule\//,''))
    cwic_response = build_raw_client.send(request.method.downcase, path)
    render xml: cwic_response.body, status: cwic_response.status
  end

  private
  def fetch_links_to_file(response)
    hash = Hash.from_xml(response)
    entries = hash['feed']['entry'] if hash['feed'] && hash['feed']['entry']
    entries.map{|entry| entry['link'].select{|link| link['rel'] == 'enclosure'}.map{|link| link['href']}}.join("\n")
  end

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
