require 'json'

class Project < ActiveRecord::Base
  obfuscate_id spin: 53465485

  def url
    "#{self.path.split('?')[0]}?projectId=#{self.to_param}"
  end
end
