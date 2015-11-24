module VCR
  class Logger
    def request_summary(request, request_matchers)
      attributes = [request.method, request.uri]
      attributes << request.body.to_s.inspect if request_matchers.include?(:body)
      attributes << request.headers.inspect if request_matchers.include?(:headers)
      "[#{attributes.join(" ")}]"
    end
  end
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

    def self.compare_tokens(r1, r2)
      r1.headers['Echo-Token'] == r2.headers['Echo-Token']
    end

    def self.register_normalizer(normalizer)
      @persister.normalizers << normalizer
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
      VCR.request_matchers.register(:token) { |r1, r2| compare_tokens(r1, r2) }

      options = {match_requests_on: [:method, :parsed_uri, :body]}.merge(options)
      default_record_mode = options[:record] || :new_episodes

      lock = Mutex.new
      c.around_http_request do |request|
        lock.synchronize do
          opts = options.deep_dup
          record = default_record_mode

          cassette = 'services'
          uri = request.uri
          if uri.include? 'orderby=relevance&isNameRequired=true&style=full&type=json'
            cassette = 'geonames'
          elsif uri.include? '/convert'
            cassette = 'ogre'
          elsif (request.method == :delete ||
                 (request.uri.include?('/orders.json') && (request.method == :get || request.method == :post)) ||
                 (request.uri.include?('/echo-rest/calendar_events') && !request.uri.include?('testbed')) ||
                 uri.include?('users/current.json') ||
                 uri.include?('/echo-rest/users.json') ||
                 request.uri.include?('4C0390AF-BEE1-32C0-4606-66CAFDD4131D/preferences.json') ||
                 request.uri.include?('69BEF8E4-7C1A-59C3-7C46-18D788AC64B4/preferences.json') ||
                 (request.headers['Echo-Token'] && request.headers['Echo-Token'].first.include?('expired-access')) ||
                 (request.headers['Echo-Token'] && request.headers['Echo-Token'].first.include?('invalid')) ||
                 uri.include?('C179002986-ORNL') ||
                 (request.uri.include?('trigger500')) ||
                 (request.uri.include?('urs.earthdata.nasa.gov/api')))
            cassette = 'hand-edited'
            record = :none
          elsif request.uri.include? '/search/granules/timeline.json'
            cassette = 'timeline'
          elsif request.uri.include? '/search/'
            parts = request.uri.split('/search/')[1]
            cassette = parts.split(/\.|\/|\?/).first
          elsif request.uri.include? '/catalog-rest/'
            parts = request.uri.split(/\/catalog-rest\/(?:echo_catalog\/)?/)[1]
            cassette = parts.split(/\.|\/|\?/).first
          elsif request.uri.include? '/echo-rest/'
            parts = request.uri.split('/echo-rest/')[1]
            cassette = parts.split(/\.|\/|\?/).first
          elsif request.uri.include? 'nsidc.org/ops/egi/request'
            opts[:match_requests_on] = [:method, :parsed_uri, :headers]
            cassette = "hand-edited"
            record = :none
          end

          if uri.include?('users/current.json') ||
              uri.include?('preferences.json') ||
              uri.include?('orders.json') ||
              uri.include?('C179002986-ORNL')
            opts[:match_requests_on] << :token
          end

          opts[:record] = record

          VCR.use_cassette(cassette, opts, &request)
        end
      end
    end
  end
end
