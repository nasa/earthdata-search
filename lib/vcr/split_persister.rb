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
    end

    def [](name)
      return @storage[name.to_s] if @storage[name.to_s].present?

      persisted_requests = @persister[file_name(name, 'requests')]
      persisted_responses = @persister[file_name(name, 'responses')]

      return nil if persisted_requests.nil? || persisted_responses.nil?

      requests = @destination_serializer.deserialize(persisted_requests)
      responses = @destination_serializer.deserialize(persisted_responses)

      obj = {'http_interactions' => []}

      requests.each do |k, v|
        if k == 'http_interactions'
          v.each do |interaction|
            response = responses[interaction.delete('digest')]
            interaction.merge!(response)
            normalizers.each do |normalizer|
              normalizer.reverse(interaction)
            end
            obj[k] << interaction
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
          v = v.sort_by {|interaction| unique_key(interaction)}
          v.each do |interaction|
            response = interaction.extract!('response')
            normalizers.each do |normalizer|
              normalizer.forward(interaction)
            end
            digest = Digest::SHA1.hexdigest(unique_key(interaction))
            interaction['digest'] = digest
            requests[k] << interaction
            responses[digest] = response
          end
        else
          requests[k] = v
        end
      end

      @persister[file_name(name, 'requests')] = @destination_serializer.serialize(requests)
      @persister[file_name(name, 'responses')] = @destination_serializer.serialize(responses)
      content
    end

    def absolute_path_to_file(*args)
      @persister.absolute_path_to_file(*args)
    end

    private

    def unique_key(interaction)
      req = interaction['request']
      "#{req['uri']}::#{req['method']}::#{req['body']['string']}"
    end

    def file_name(root, type)
      "#{root}#{type}.#{@destination_serializer.file_extension}"
    end
  end
end
