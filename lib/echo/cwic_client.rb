module Echo
  class CwicClient < BaseClient
    def get_cwic_granules(short_name, token=nil)
      get("/opensearch/granules.atom?datasetId=#{short_name}&clientId=#{Rails.configuration.cmr_client_id}")
    end
  end
end