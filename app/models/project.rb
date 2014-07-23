require 'json'

class Project < ActiveRecord::Base
  obfuscate_id spin: 53465485

  def url
    "#{self.path.split('?')[0]}?projectId=#{self.to_param}"
  end

  def number_datasets
    project_query = self.path.split('p=!')[1]
    dataset_list = project_query.split('&')[0]
    dataset_ids = dataset_list.split('!')
    dataset_ids.size
  rescue
    0
  end
end
