class EventsController < ApplicationController
  respond_to :json

  def index
    events = []
    echo_response = echo_client.get_availability_events
    if echo_response.success?
      echo_response.body.each do |event|
        event['notification_type'] = event.delete 'severity'
        event.delete 'owner_provider_id'
        event['starttime'] = event.delete 'start_date'
        event['endtime'] = event.delete 'end_date'
        events.push event
      end
    end

    status_response = echo_client.get_notifications(@cmr_env)
    if status_response.success? && status_response.body['success']
      events.push status_response.body['notifications']
    end

    status = echo_response.status == 200 ? (status_response.status == 200 ? 200 : status_response.status) : echo_response.status

    respond_with(events.flatten, status: status)
  end
end
