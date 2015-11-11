class AccessConfiguration < ActiveRecord::Base
  belongs_to :user
  store :service_options, coder: JSON

  def self.get_default_options(user, cmr_concept_id)
    access_config = self.find_by(user: user, dataset_id: cmr_concept_id)
    if access_config
      access_config.service_options
    else
      nil
    end
  end

  def self.set_default_options(user, cmr_concept_id, options)
    access_config = self.find_or_initialize_by(user: user, dataset_id: cmr_concept_id)
    access_config.service_options = options
    access_config.save!
  end
end
