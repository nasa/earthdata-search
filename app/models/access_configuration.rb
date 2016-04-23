require 'digest/sha1'

class AccessConfiguration < ActiveRecord::Base
  belongs_to :user
  store :service_options, coder: JSON

  def self.get_default_access_config(user, cmr_concept_id)
    self.find_by(user: user, dataset_id: cmr_concept_id)
  end

  def self.set_default_access_config(user, cmr_concept_id, options, echoform)
    access_config = self.find_or_initialize_by(user: user, dataset_id: cmr_concept_id)
    access_config.service_options = options
    access_config.echoform_digest = echoform.nil? ? nil : Digest::SHA1.hexdigest(echoform.join("\n"))
    access_config.save!
  end
end
