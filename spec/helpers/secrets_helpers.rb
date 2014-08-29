module Helpers
  module SecretsHelpers
    def urs_tokens
      $_spec_config ||= YAML.load(ERB.new(File.read(Rails.root.join('spec/config.yml'))).result)
      $_spec_config['urs_tokens']
    end
  end
end
