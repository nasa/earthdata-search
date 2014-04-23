class EventsController < ApplicationController
  respond_to :json

  def index
    echo_response = Echo::Client.get_availability_events
    respond_with(echo_response.body, status: echo_response.status)
  end
end
