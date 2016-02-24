module Echo
  class CwicClient < BaseClient
    def get_cwic_granules(short_name, start_page=1, count=10, temporal=nil)
      params = default_params.merge({
        datasetId: short_name,
        startPage: start_page,
        count: count
      })
      if temporal.present?
        time_start, time_end = temporal.split(',')
        # Remove milliseconds from the date/time
        params[:timeStart] = time_start.gsub(/\.\d+Z$/, 'Z') if time_start.present?
        params[:timeEnd] = time_end.gsub(/\.\d+Z$/, 'Z') if time_end.present?
      end

      get("/opensearch/granules.atom", params)
    end

    private

    def default_params
      { clientId: Rails.configuration.cmr_client_id }
    end
  end
end
