module Echo
  class BrowseScalerClient < BaseClient
    def get_browse_scaler_availability
      get("/browse-scaler/availability")
    end
  end
end
