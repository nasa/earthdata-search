class Retrieval < ActiveRecord::Base
  belongs_to :user
  store :jsondata, coder: JSON

  after_save :update_access_configurations

  obfuscate_id spin: 53465485

  private

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
