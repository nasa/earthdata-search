class CreateRetrievalCollections < ActiveRecord::Migration
  def change
    create_table :retrieval_collections do |t|
      t.references :retrieval, index: true, foreign_key: true
      t.text :access_method
      t.string :collection_id
      t.text :collection_metadata
      t.text :granule_params
      t.integer :granule_count

      t.timestamps null: false
    end
  end
end
