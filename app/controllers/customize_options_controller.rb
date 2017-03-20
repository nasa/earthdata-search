class CustomizeOptionsController < ApplicationController
  respond_to :json

  def index
    respond_with echo_client.customize_options, status: 200
  end
end
