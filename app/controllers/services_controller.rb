class ServicesController < ApplicationController
  around_action :log_execution_time

  respond_to :json

  def show
    response = echo_client.get_service(params[:id], {}, token)

    respond_with(response.body, status: response.status)
  end
end
