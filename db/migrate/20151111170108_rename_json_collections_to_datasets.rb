class RenameJsonCollectionsToDatasets < ActiveRecord::Migration
  # Reverse an accidentally-applied migration which renames datasets to collections
  # and potentially causes downtime

  def up
    Retrieval.find_each do |retrieval|
      if retrieval.jsondata.present? && retrieval.jsondata.key?('collections')
        retrieval.jsondata['datasets'] = retrieval.jsondata.delete('collections')
        retrieval.save
      end
    end
  end

  def down
  end
end
