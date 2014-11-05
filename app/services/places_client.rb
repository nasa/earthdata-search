class PlacesClient
  # Register custom middleware
  Faraday.register_middleware(:response,
                              :logging => Echo::ClientMiddleware::LoggingMiddleware)


  PLACES_URL = ENV['places_url']
  USER_ID = ENV['places_user_id']

  def self.get_place_completions(placename)
    params = {
      username: USER_ID,
      maxRows: 5,
      q: placename,
      orderby: 'relevance',
      isNameRequired: true,
      style: 'full',
      type: 'json'
    }
    completions = connection.get('/search', params).body

    return [] unless completions.present? && completions['geonames']

    completions['geonames']
  end

  def self.connection
    Thread.current[:edsc_places_connection] ||= self.build_connection
  end

  private

  def self.get(url, params={})
    connection.get(url, params)
  end

  def self.build_connection
    Faraday.new(:url => PLACES_URL) do |conn|
      conn.response :logging
      conn.response :json, :content_type => /\bjson$/
      conn.adapter  Faraday.default_adapter
    end
  end
end
