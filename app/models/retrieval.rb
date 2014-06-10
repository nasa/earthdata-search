class Retrieval < ActiveRecord::Base
  belongs_to :user

  obfuscate_id spin: 53465485

  store :jsondata, coder: JSON
end
