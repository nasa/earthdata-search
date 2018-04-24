module ServiceUtils
  extend ActiveSupport::Concern

  DEFAULT_PAGE_SIZE = 20

  def retrieve_services(params = {}, token = nil)
    cmr_params = {
      # page_size: DEFAULT_PAGE_SIZE
    }.merge(params.stringify_keys).select { |k, _v| %w(concept_id cmr_format).include?(k) }

    echo_client.get_services(cmr_params, token)
  end

  def retrieve_service(service_id, token = nil, format = 'umm_json')
    echo_client.get_service(service_id, token, format)
  end
end
