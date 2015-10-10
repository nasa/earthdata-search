class HealthController < ApplicationController
  respond_to :json
  def index
    response = {
        delayed_job: Health.delayed_job_status,
        data_load: Health.data_load_status,
        colormaps_load: Health.colormap_load_status,
        echo: echo_status,
        cmr: cmr_status,
        urs: urs_status,
        edsc_search: edsc_search_status,
        edsc_landing: edsc_landing_status
    }
    respond_with(response, status: :ok)
  end
end
