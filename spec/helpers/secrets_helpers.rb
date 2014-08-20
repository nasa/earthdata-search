module Helpers
  module SecretsHelpers
    def urs_tokens
      $_spec_config ||= YAML.load_file(Rails.root.join('spec/config.yml'))
      JSON.parse($_spec_config['urs_tokens'])
    end
  end
end
