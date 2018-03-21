module Ous
  class Client
    def self.client_for_environment(env, service_configs)
      env_config = service_configs['earthdata'][env]
      Ous::Client.new(env_config)
    end

    def initialize(service_config)
      @config = service_config
      clients = []
      clients << OusClient.new(@config['ous_root'])
      @clients = clients
    end

    def method_missing(method_name, *arguments, &block)
      client = @clients.find { |c| c.respond_to?(method_name) }
      if client
        client.send(method_name, *arguments, &block)
      else
        super
      end
    end

    def respond_to?(method_name, include_private = false)
      @clients.any? { |c| c.respond_to?(method_name, include_private) } || super
    end
  end
end
