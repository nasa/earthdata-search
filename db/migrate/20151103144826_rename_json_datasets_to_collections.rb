class RenameJsonDatasetsToCollections < ActiveRecord::Migration
  def up
    Retrieval.find_each do |retrieval|
      if retrieval.jsondata.present? && retrieval.jsondata.key?('datasets')
        retrieval.jsondata['collections'] = retrieval.jsondata.delete('datasets')
        retrieval.save
      end
    end
  end

  def down
    Retrieval.find_each do |retrieval|
      if retrieval.jsondata.present? && retrieval.jsondata.key?('collections')
        retrieval.jsondata['datasets'] = retrieval.jsondata.delete('collections')
        retrieval.save
      end
    end
  end
end
