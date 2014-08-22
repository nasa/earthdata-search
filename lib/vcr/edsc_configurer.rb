module VCR
  class EDSCLoggerStream
    def puts(message)
      if message.start_with?('[faraday] Identified request type (recordable)')
        $stderr.puts message.gsub('Identified request type (recordable)', 'Performing real request')
      end
    rescue => e
      $stderr.puts "Logger error: #{e.inspect}"
    end
  end

  module EDSCConfigurer
    def self.compare_uris(r1, r2)
      return true if r1.uri == r2.uri
      p1, q1 = r1.uri.split('?')
      p2, q2 = r2.uri.split('?')

      return false unless p1 == p2 && q1 && q2 && q1.size == q2.size

      # Compare parsed query strings so irrelevant parameter order doesn't affect matches
      Rack::Utils.parse_nested_query(q1) == Rack::Utils.parse_nested_query(q2)
    end

    def self.register_token(name, token)
      @persister.tokens[name] = token
    end

    def self.configure(c, options={})
      c.cassette_library_dir = 'fixtures/cassettes'
      c.hook_into :faraday

      c.debug_logger = EDSCLoggerStream.new

      c.cassette_serializers[:null] = VCR::NullSerializer.new
      @persister = c.cassette_persisters[:edsc] = VCR::SplitPersister.new(c.cassette_serializers[:null],
                                                             c.cassette_serializers[:yaml],
                                                             c.cassette_persisters[:file_system])
      c.default_cassette_options = { persist_with: :edsc, serialize_with: :null }

      VCR.request_matchers.register(:parsed_uri) { |r1, r2| compare_uris(r1, r2) }

      opts = {match_requests_on: [:method, :parsed_uri, :body]}.merge(options)
      default_record_mode = options[:record] || :new_episodes

      lock = Mutex.new
      c.around_http_request do |request|
        lock.synchronize do
          opts = opts.dup
          record = default_record_mode

          cassette = 'services'
          uri = request.uri
          if uri.start_with? 'http://api.geonames.org'
            cassette = 'geonames'
          elsif uri.start_with? 'http://ogre.adc4gis.com'
            cassette = 'ogre'
          elsif request.headers['Echo-Token'] && request.headers['Echo-Token'].first.include?('expired-access')
            cassette = 'expired-token'
            record = :none
          elsif (request.method == :delete ||
                 (request.uri.include?('/orders.json') && request.method == :get) ||
                 request.uri.include?('/echo-rest/calendar_events') ||
                 request.uri.include?('69BEF8E4-7C1A-59C3-7C46-18D788AC64B4/preferences.json') ||
                 (request.uri.include?('/datasets.json') && request.uri.include?('trigger500')))
            cassette = 'hand-edited'
            record = :none
          elsif request.uri.include? '/echo-rest/users.json'
            cassette = 'echo-rest-users'
            record = :none
          elsif request.uri.include? '/echo_catalog/granules/timeline'
            cassette = 'timeline'
          elsif request.uri.include? '/catalog-rest/'
            parts = request.uri.split(/\/catalog-rest\/(?:echo_catalog\/)?/)[1]
            cassette = parts.split(/\.|\/|\?/).first
          elsif request.uri.include? '/echo-rest/'
            parts = request.uri.split('/echo-rest/')[1]
            cassette = parts.split(/\.|\/|\?/).first
          end

          if uri.include?('users/current.json') ||
              uri.include?('preferences.json') ||
              uri.include?('orders.json')
            opts[:match_requests_on] << :headers
          else
            opts[:match_requests_on].delete(:headers)
          end

          opts[:record] = record

          VCR.use_cassette(cassette, opts, &request)
        end
      end
    end
  end
end
