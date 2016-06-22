class HealthController < ApplicationController
  respond_to :json

  def index
    health = Health.new
    response = {
        edsc: nil,
        background_jobs: {
            delayed_job: health.delayed_job_status,
            data_load: health.data_load_status,
            colormaps_load: health.colormap_load_status,
        },
        dependencies: {
            echo: health.echo_status(echo_client),
            cmr: health.cmr_status(echo_client),
            opensearch: health.opensearch_status(echo_client),
            browse_scaler: health.browse_scaler_status(echo_client),
            urs: health.urs_status(echo_client)}
    }
    response[:edsc] = health.edsc_status
    respond_with(response, status: :ok)
  end
end
