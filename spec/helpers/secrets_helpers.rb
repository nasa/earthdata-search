module Helpers
  module SecretsHelpers
    def load_tokens!
      config = YAML.load(ERB.new(File.read(Rails.root.join('spec/config.yml'))).result)
      $_spec_config = config['urs_tokens']
      if config['token_user_username'].present?
        client = Echo::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
        response = client.create_token(config['token_user_username'], config['token_user_password'])
        raise "Could not create token: #{response.body.to_json}" unless response.success?
        $_spec_config[config['token_user_username']] = {
          'access_token' => response.body['token']['id'],
          'refresh_token' => response.body['token']['id'],
          'expires_in' => 3600
        }
      end
    end

    def urs_tokens
      load_tokens! unless $_spec_config
      $_spec_config
    end
  end
end
