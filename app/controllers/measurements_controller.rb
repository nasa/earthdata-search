class MeasurementsController < ApplicationController
  respond_to :json

  def index
    respond_with echo_client.measurements, status: 200
  end
end
