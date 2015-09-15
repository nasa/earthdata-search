class Retrieval < ActiveRecord::Base
  include ActionView::Helpers::TextHelper
  belongs_to :user
  store :jsondata, coder: JSON

  after_save :update_access_configurations

  obfuscate_id spin: 53465485

  def description
    @description ||= jsondata['description']
    unless @description
      datasets = jsondata['datasets']
      dataset = datasets.first
      @description = get_dataset_id(dataset['id']) if dataset

      if @description
        if datasets.size > 1
          @description += " and #{pluralize(datasets.size - 1, 'other dataset')}"
        end
      else
        @description = pluralize(datasets.size, 'dataset')
      end
      jsondata['description'] = @description
      save!
    end
    @description
  end

  # Delayed Jobs calls this method to excute an order creation
  def self.process(id, token, env, base_url)
    if Rails.env.test?
      normalizer = VCR::HeaderNormalizer.new('Echo-Token', token + ':' + Rails.configuration.urs_client_id, 'edsc')
      VCR::EDSCConfigurer.register_normalizer(normalizer)
    end
    retrieval = Retrieval.find_by_id(id)
    project = retrieval.jsondata
    user_id = retrieval.user.echo_id
    client = Echo::Client.client_for_environment(env, Rails.configuration.services)

    project['datasets'].each do |dataset|
      params = Rack::Utils.parse_query(dataset['params'])
      params.merge!(page_size: 2000, page_num: 1)

      access_methods = dataset['serviceOptions']['accessMethod']
      access_methods.each do |method|
        if method['type'] == 'order'
          order_response = client.create_order(params,
                                                method['id'],
                                                method['method'],
                                                method['model'],
                                                user_id,
                                                token,
                                                client)
          method[:order_id] = order_response[:order_id]
        elsif method['type'] == 'service'
          request_url = "#{base_url}/data/retrieve/#{retrieval.to_param}"

          method[:dataset_id] = dataset['id']
          service_response = MultiXml.parse(ESIClient.submit_esi_request(dataset['id'], params, method, request_url, client, token).body)
          method[:order_id] = service_response['agentResponse'].nil? ? nil : service_response['agentResponse']['order']['orderId']
          method[:error_code] = service_response['Exception'].nil? ? nil : service_response['Exception']['Code']
          method[:error_message] = service_response['Exception'].nil? ? nil : service_response['Exception']['Message']
        end
      end
    end

    retrieval.jsondata = project
    retrieval.save!
  end

  private

  def get_dataset_id(id)
    result = nil
    client = Echo::Client.client_for_environment(@echo_env || 'ops', Rails.configuration.services)
    response = client.get_datasets(echo_collection_id: [id])
    if response.success?
      entry = response.body['feed']['entry'].first
      result = entry['title'] if entry
    end
    result
  end

  def update_access_configurations
    Array.wrap(self.jsondata['datasets']).each do |dataset|
      if dataset.key?('serviceOptions') && dataset.key?('id')
        config = AccessConfiguration.find_or_initialize_by('dataset_id' => dataset['id'])
        config.service_options = dataset['serviceOptions']
        config.user = self.user
        config.save!
      end
    end
  end
end
