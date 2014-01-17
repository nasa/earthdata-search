class PlacesClient
  # Register custom middleware
    Faraday.register_middleware(:response,
                                :logging => Echo::ClientMiddleware::LoggingMiddleware)

    API_ID = 'AIzaSyDdnyPxry2fpoctmXeFKEpE2K1EWWnkU6I'
    PLACES_URL="https://maps.googleapis.com/maps/api/place/"

    def self.get_place_completions(placename)
      params = {
        input: placename,
        sensor: false,
        key: API_ID,
        types: "(regions)",
        language: "en"
      }
      completions = connection.get('/maps/api/place/autocomplete/json', params).body

      return [] unless completions.present? && completions['status'] == 'OK'

      completions['predictions']
    end

    def self.get_spatial_for_place(ref)
      params = {
        reference: ref,
        sensor: false,
        key: API_ID,
        language: "en"
      }
      details = connection.get('/maps/api/place/details/json', params).body

      return nil unless details.present? && details['status'] == 'OK'

      location = details['result']['geometry']['location']
      "point:#{location['lng']},#{location['lat']}"
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
