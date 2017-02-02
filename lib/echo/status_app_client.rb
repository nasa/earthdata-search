module Echo
  class StatusAppClient < BaseClient
    def get_notifications(env)
      get("notifications", {domain: Rails.configuration.services['earthdata'][env]['status_app_domain']})
    end
  end
end