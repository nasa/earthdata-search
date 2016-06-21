require 'digest/sha1'
require 'json'

class AccessConfiguration < ActiveRecord::Base
  belongs_to :user
  store :service_options, coder: JSON

  def self.get_default_access_config(user, cmr_concept_id)
    access_config = self.find_by(user: user, dataset_id: cmr_concept_id)
    access_config.echoform_digest = JSON.parse(access_config.echoform_digest) if access_config.present? && access_config.echoform_digest.present?
    access_config
  end

  def self.set_default_access_config(user, cmr_concept_id, options, form_hashes)
    access_config = self.find_or_initialize_by(user: user, dataset_id: cmr_concept_id)
    access_config.service_options = options
    access_config.echoform_digest = form_hashes.nil? ? nil : form_hashes.to_json
    access_config.save!
  end
end
