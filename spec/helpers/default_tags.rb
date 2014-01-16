module Helpers
  module DefaultTags
    def self.included(host)
      host.metadata[:reset] = true unless host.metadata.key?(:reset)
    end
  end
end
