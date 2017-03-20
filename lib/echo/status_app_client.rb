module Echo
  class StatusAppClient < BaseClient
    def get_notifications(env)
      Echo::PrototypeResponse.new(Rails.configuration.lab_yaml['https://status.earthdata.nasa.gov/api/v1/notifications?domain=https%3A%2F%2Fsearch.earthdata.nasa.gov'])
    end
  end
end