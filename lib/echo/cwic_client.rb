module Echo
  class CwicClient < BaseClient
    def get_cwic_granules(short_name, start_page=1, count=10)
      get("/opensearch/granules.atom?datasetId=#{short_name}&clientId=#{Rails.configuration.cmr_client_id}&startPage=#{start_page}&count=#{count}")
    end
  end
end