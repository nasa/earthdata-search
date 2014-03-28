require 'digest/sha1'
module VCR
  class SplitPersister
    def initialize(source_serializer, destination_serializer, persister)
      @source_serializer = source_serializer
      @destination_serializer = destination_serializer
      @persister = persister
      @storage = {}
    end

    def [](name)
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
            obj[k] << interaction
          end
        else
          obj[k] = v
        end
      end

      @source_serializer.serialize(obj)
    end

    def []=(name, content)
      obj = @source_serializer.deserialize(content)

      requests = {'http_interactions' => []}
      responses = {}

      obj.each do |k, v|
        if k == 'http_interactions'
          v.each do |interaction|
            response = interaction.extract!('response')
            digest = Digest::SHA1.hexdigest(@destination_serializer.serialize(interaction['request']))
            interaction['digest'] = digest
            requests[k] << interaction
            responses[digest] = response
          end
        else
          requests[k] = v
        end
      end

      requests['http_interactions'].sort_by! {|interaction| interaction['digest']}
      responses = Hash[responses.sort_by{|digest, _| digest}]

      @persister[file_name(name, 'requests')] = @destination_serializer.serialize(requests)
      @persister[file_name(name, 'responses')] = @destination_serializer.serialize(responses)
      content
    end

    private

    def file_name(root, type)
      "#{root}#{type}.#{@destination_serializer.file_extension}"
    end
  end
end
