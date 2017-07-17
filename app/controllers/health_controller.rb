class HealthController < ApplicationController
  respond_to :json

  def index
    health = Health.new
    cmr_status = health.cmr_status(echo_client)
    cmr_search_status = health.cmr_search_status(echo_client)
    echo_status = health.echo_status(echo_client)
    opensearch_status = health.opensearch_status(echo_client)
    browse_scaler_status = health.browse_scaler_status(echo_client)
    urs_status = health.urs_status(echo_client)
    service_unavailable = false
    if !cmr_status[:ok?] && cmr_status[:status] > 499
      Rails.logger.error "Health failure: CMR '/search/health' returns #{cmr_status[:status]}. Return 503 from Earthdata Search."
      service_unavailable = true
    elsif !cmr_search_status[:ok?] && cmr_search_status[:status] > 499
      Rails.logger.error "Health failure: CMR '/search/collections.json' returns #{cmr_search_status[:status]}. Return 503 from Earthdata Search."
      service_unavailable = true
    elsif !echo_status[:ok?] && echo_status[:status] > 499
      Rails.logger.error "Health failure: ECHO '/availability.json' returns #{echo_status[:status]}. Return 503 from Earthdata Search."
      service_unavailable = true
    elsif !opensearch_status[:ok?] && opensearch_status[:status] > 499
      Rails.logger.error "Health failure: OpenSearch '/opensearch' returns #{opensearch_status[:status]}. Return 503 from Earthdata Search."
      service_unavailable = true
    elsif !browse_scaler_status[:ok?] && browse_scaler_status[:status] > 499
      Rails.logger.error "Health failure: Browse Scaler '/availability' returns #{browse_scaler_status[:status]}. Return 503 from Earthdata Search."
      service_unavailable = true
    elsif !urs_status[:ok?] && urs_status[:status] > 499
      Rails.logger.error "Health failure: URS '/' returns #{urs_status[:status]}. Return 503 from Earthdata Search."
      service_unavailable = true
    end

    if service_unavailable
      head :service_unavailable
    else
      response = {
          edsc: nil,
          background_jobs: {
              delayed_job: health.delayed_job_status,
              data_load_tags: health.data_load_tags_status,
              data_load_echo10: health.data_load_echo10_status,
              data_load_granules: health.data_load_granules_status,
              colormaps_load: health.colormap_load_status,
          },
          dependencies: {
              echo: echo_status,
              cmr: cmr_status,
              cmr_search: cmr_search_status,
              opensearch: opensearch_status,
              browse_scaler: browse_scaler_status,
              urs: urs_status}
      }
      response[:edsc] = health.edsc_status
      respond_with(response, status: :ok)
    end
  end
end
