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

  def insert_cached_cassette(name, options={})
    options = options.merge(allow_playback_repeats: true) unless options.key?(:allow_playback_repeats)
    @cassette_cache ||= {}
    key = "#{name}/#{options.to_json}"
    cassette = @cassette_cache[key]
    if cassette && turned_on? && !cassettes.any? {|c| c.name == name}
      cassettes.push(cassette)
    else
      @cassette_cache[key] = cassette = insert_cassette(name, options)
    end
    cassette
  end

  def use_cached_cassette(name, options={}, &block)
    cassette = insert_cached_cassette(name, options)
    begin
      call_block(block, cassette)
    ensure
      eject_cassette
      # Reset cassette internals so newly-recorded fixtures get picked up
      cassette.instance_exec do
        @http_interactions = nil
        @previously_recorded_interactions = merged_interactions
        @new_recorded_interactions = []
      end
    end
  end

  module EDSCConfigurer
    def self.persister
      @persister
    end

    def self.compare_uris(r1, r2)
      return true if r1.uri == r2.uri
      p1, q1 = r1.uri.split('?')
      p2, q2 = r2.uri.split('?')

      return false unless p1 == p2 && q1 && q2 && q1.size == q2.size

      # Compare parsed query strings so irrelevant parameter order doesn't affect matches
      Rack::Utils.parse_nested_query(q1) == Rack::Utils.parse_nested_query(q2)
    end

    def self.compare_tokens(r1, r2)
      t1 = r1.headers['Echo-Token']
      t2 = r2.headers['Echo-Token']
      t1 = t1.first if t1.is_a?(Array)
      t2 = t2.first if t2.is_a?(Array)
      return false unless t1.present? == t1.present?
      @persister.normalizers.select do |normalizer|
        if normalizer.is_a?(HeaderNormalizer) && normalizer.header == 'Echo-Token'
          t1 = normalizer.substitute if t1 == normalizer.value
          t2 = normalizer.substitute if t2 == normalizer.value
        end
      end
      t1 == t2
    end

    def self.compare_esi_request_body(r1, r2)
      query1 = Rack::Utils.parse_nested_query(r1.body)
      query2 = Rack::Utils.parse_nested_query(r2.body)
      keys_to_compare = ['FILE_IDS', 'EMAIL']
      query1.map do |k, v|
        return false if (keys_to_compare.include? k) && (v != query2[k])
      end
      true
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
      VCR.request_matchers.register(:esi_request_body) { |r1, r2| compare_esi_request_body(r1, r2) }

      options = {match_requests_on: [:method, :parsed_uri, :body]}.merge(options)
      default_record_mode = options[:record] || :new_episodes

      lock = Mutex.new

      c.ignore_request do |request|
        request.uri.include?('/echo-rest/tokens.json')
      end

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
          elsif uri.include?('/echo-rest/orders')
            cassette = 'orders'
            opts[:match_requests_on] << :token
            record = :none
          elsif (request.method == :delete ||
                 (uri.include?('/echo-rest/calendar_events') && !uri.include?('testbed')) ||
                 uri.include?('users/current.json') ||
                 uri.include?('/echo-rest/users.json') ||
                 uri.include?('/preferences.json') ||
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
          elsif (request.uri.include? 'ops/egi/request') && (request.uri.include? 'nsidc.org')
            opts[:match_requests_on] = [:method, :parsed_uri, :headers, :esi_request_body]
            cassette = "hand-edited"
            record = :none
          end

          if uri.include?('users/current.json') ||
              uri.include?('preferences.json') ||
              uri.include?('C179002986-ORNL')
            opts[:match_requests_on] << :token
          end

          record = :all if ENV['record'] && ENV['record'].split(',').include?(cassette)
          opts[:record] = record

          ActiveSupport::Notifications.instrument "edsc.performance", activity: "HTTP Request (#{cassette})", cassette: cassette do
              VCR.use_cached_cassette(cassette, opts, &request)
          end
        end
      end
    end
  end
end
