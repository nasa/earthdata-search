json.array! @collections do |collection|
  json.id collection.id
  json.collection_id collection.collection_id
  json.granule_count collection.granule_count
end
