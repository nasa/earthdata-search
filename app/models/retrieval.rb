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
