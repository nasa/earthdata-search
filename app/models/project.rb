require 'json'

class Project < ActiveRecord::Base
  obfuscate_id spin: 53465485

  validate :jsondata_must_be_valid_json

  def jsondata_must_be_valid_json
    begin
      JSON.parse(jsondata)
    rescue
      errors.add('jsondata', 'must be valid json')
    end
  end
end
