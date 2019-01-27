json.id @collection.id
json.collection_id @collection.collection_id
json.granule_count @collection.granule_count

json.orders @collection.orders do |order|
  json.id order.id
end
