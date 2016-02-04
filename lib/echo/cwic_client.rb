module Echo
  class CwicClient < BaseClient
    def get_cwic_granules(short_name, start_page=1, count=10, temporal=nil)
      if temporal
        timeStart, timeEnd = temporal.split(',')
        # FIXME: Faraday encodes query params in GETs sent to CWIC. However, CWIC endpoint doesn't take encoded url params
        # For example, this request returns a 400 error:
        #     http://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=gov.noaa.class.J2-XGDR&clientId=eed-edsc-dev&startPage=1&count=20&timeStart=2010-02-03T00%3A00%3A00.000Z&timeEnd=2010-02-03T23%3A59%3A59.000Z
        # Faraday supports a custom params_encoder in 0.9.0+, but upgrading the gem results in an undefined method in
        # base_client Faraday.register_middleware.
        # Send only dates to CWIC endpoint for now.

        # temporal_query = "&timeStart=#{timeStart}&timeEnd=#{timeEnd}"
        temporal_query = "&timeStart=#{timeStart.split('T')[0]}&timeEnd=#{timeEnd.split('T')[0]}"
      end
      get("/opensearch/granules.atom?datasetId=#{short_name}&clientId=#{Rails.configuration.cmr_client_id}&startPage=#{start_page}&count=#{count}#{temporal_query.nil? ? '' : temporal_query}")
    end
  end
end