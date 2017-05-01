class EventsController < ApplicationController
  respond_to :json

  def index
    events = []
    status_response = echo_client.get_notifications(@cmr_env)
    if status_response.success? && status_response.body['success']
      events.push status_response.body['notifications']
    end

    respond_with(events.flatten, status: status_response.status)
  end
end
