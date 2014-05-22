module VCR
  module EDSCConfigurer
    def self.configure(c, options={})
      c.cassette_library_dir = 'fixtures/cassettes'
      c.hook_into :faraday

      c.cassette_serializers[:null] = VCR::NullSerializer.new
      c.cassette_persisters[:edsc] = VCR::SplitPersister.new(c.cassette_serializers[:null],
                                                             c.cassette_serializers[:yaml],
                                                             c.cassette_persisters[:file_system])
      c.default_cassette_options = { persist_with: :edsc, serialize_with: :null }

      opts = {match_requests_on: [:method, :uri, :body]}.merge(options)
      default_record_mode = options[:record] || :new_episodes

      lock = Mutex.new
      c.around_http_request do |request|
        lock.synchronize do
          opts = opts.dup
          record = default_record_mode

          cassette = 'global'
          uri = request.uri
          if uri.start_with? 'http://api.geonames.org'
            cassette = 'geonames'
          elsif uri.start_with? 'http://ogre.adc4gis.com'
            cassette = 'ogre'
          elsif request.uri.include?('fail%25+hard') || request.uri.include?('fail+hard')
            cassette = 'expired-token'
            record = :none
          elsif (request.method == :delete ||
                 (request.uri.include?('/orders.json') && request.method == :get) ||
                 request.uri.include?('/echo-rest/calendar_events') ||
                 (request.uri.include?('/datasets.json') && request.uri.include?('trigger500')))
            cassette = 'hand-edited'
            record = :none
          elsif request.uri.include? '/echo-rest/users.json'
            cassette = 'echo-rest-users'
            record = :none
          elsif request.uri.include? '/echo_catalog/granules/timeline'
            cassette = 'timeline'
          elsif request.uri.include? '/catalog-rest/'
            cassette = 'catalog-rest'
          elsif request.uri.include? '/echo-rest/'
            cassette = 'echo-rest'
          end

          opts[:record] = record

          Rails.logger.info("#{request.uri} [#{cassette}] -> #{opts.inspect}")

          VCR.use_cassette(cassette, opts, &request)
        end
      end
    end
  end
end
