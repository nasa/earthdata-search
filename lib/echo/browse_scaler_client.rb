module Echo
  class BrowseScalerClient < BaseClient
    def get_browse_scaler_availability
      get("availability")
    end
  end
end
