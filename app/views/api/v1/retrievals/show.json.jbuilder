json.query @retrieval.jsondata['query']
json.source @retrieval.source

if @retrieval.retrieval_collections.empty?
  json.collections @retrieval.project['collections']
else
  json.collections @retrieval.retrieval_collections do |collection|
    json.id collection.collection_id
    json.params collection.granule_params.to_query

    json.serviceOptions do
      json.accessMethod do
        json.child! do
          json.type collection.access_method['type']
          json.collection_id collection.collection_id

          json.partial! collection.access_method['type'], locals: { collection: collection }
        end
      end
    end
  end
end
