require 'json'

class Project < ActiveRecord::Base
  belongs_to :user
  obfuscate_id spin: 53465485

  def url
    "#{self.path.split('?')[0]}?projectId=#{self.to_param}"
  end

  def number_datasets
    dataset_list = self.path[/[?&]p=([\w!-]+)/, 1]
    dataset_ids = dataset_list.split('!').map(&:presence).compact.uniq
    dataset_ids.size
  rescue
    0
  end
end
