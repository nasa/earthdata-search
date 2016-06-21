require 'json'

class Project < ActiveRecord::Base
  belongs_to :user
  obfuscate_id spin: 53465485

  default_scope { order('updated_at DESC') }

  def url
    "#{self.path.split('?')[0]}?projectId=#{self.to_param}"
  end

  def number_collections
    collection_list = self.path[/[?&]p=([\w!-]+)/, 1]
    collection_ids = collection_list.split('!').map(&:presence).compact.uniq
    collection_ids.size
  rescue
    0
  end
end
