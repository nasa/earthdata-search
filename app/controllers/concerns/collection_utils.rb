module CollectionUtils
  extend ActiveSupport::Concern

  DEFAULT_PAGE_SIZE = 20

  def retrieve_collections(params = {}, token = nil)
    cmr_params = {
      page_size: DEFAULT_PAGE_SIZE
    }.merge(params.stringify_keys).select { |k, _v| %w(concept_id cmr_format page_name page_size).include?(k) }

    echo_client.get_collections(cmr_params, token)
  end

  def retrieve_collection(collection_id, token = nil, format = 'umm_json')
    echo_client.get_collection(collection_id, token, format)
  end
end
