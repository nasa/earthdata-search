class ServicesController < ApplicationController
  include ServiceUtils

  around_action :log_execution_time

  respond_to :json

  def index
    response = retrieve_services(params, token)

    respond_with(response.body, status: response.status)
  end

  def show
    response = retrieve_service(params[:id], token)

    respond_with(response.body, status: response.status)
  end
end
