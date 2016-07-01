require 'digest/sha1'
module VCR
  class SplitPersister

    attr_reader :normalizers

    def initialize(source_serializer, destination_serializer, persister)
      @source_serializer = source_serializer
      @destination_serializer = destination_serializer
      @persister = persister
      @storage = {}
      @normalizers = []
      @reduced = {}
    end

    def [](name)
      return @storage[name.to_s] if @storage[name.to_s].present?

      requests_name = file_name(name, 'requests')
      responses_name = file_name(name, 'responses')

      persisted_requests = @persister[file_name(name, 'requests')]
      persisted_responses = @persister[file_name(name, 'responses')]

      return nil if persisted_requests.blank? || persisted_responses.blank?

      requests = @destination_serializer.deserialize(persisted_requests)
      responses = @destination_serializer.deserialize(persisted_responses)

      obj = {'http_interactions' => []}

      requests.each do |k, v|
        if k == 'http_interactions'
          v.each do |interaction|
            response = responses.delete(interaction.delete('digest'))
            unless response.nil?
              interaction.merge!(response)
              normalizers.each do |normalizer|
                normalizer.reverse(interaction)
              end
              obj[k] << interaction
            end
          end
        else
          obj[k] = v
        end
      end

      @storage[name] = @source_serializer.serialize(obj)
    end

    def []=(name, content)
      @storage.delete(name.to_s)
      obj = @source_serializer.deserialize(content)

      requests = {'http_interactions' => []}
      responses = {}

      obj.each do |k, v|
        if k == 'http_interactions'
          v.each do |interaction|
            normalizers.each do |normalizer|
              normalizer.forward(interaction)
            end
          end
          v = v.sort_by {|interaction| unique_key(interaction)}
          v.each do |interaction|
            response = interaction.extract!('response')
            digest = Digest::SHA1.hexdigest(unique_key(interaction))
            interaction['digest'] = digest
            requests[k] << interaction
            if interaction['request']['uri'].include?('collections.json')
              responses[digest] = reduce_fixture_size(response)
            else
              responses[digest] = response
            end
          end
        else
          requests[k] = v
        end
      end

      @persister[file_name(name, 'requests')] = @destination_serializer.serialize(requests)
      @persister[file_name(name, 'responses')] = @destination_serializer.serialize(responses)
      @storage[name.to_s] = content
      content
    end

    def absolute_path_to_file(*args)
      @persister.absolute_path_to_file(*args)
    end

    private

    def unique_key(interaction)
      req = interaction['request']
      "#{req['uri']}::#{req['method']}::#{req['body']['string']}::#{req['headers']['Echo-Token']}"
    end

    def file_name(root, type)
      "#{root}#{type}.#{@destination_serializer.file_extension}"
    end

  end
end
