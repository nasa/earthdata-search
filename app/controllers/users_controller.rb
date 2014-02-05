class UsersController < ApplicationController
  def login
    username = params[:username]
    password = params[:password]

    response = Echo::Client.get_token(username, password, "EDSC", request.remote_ip)

    token = response.body['token']

    if response.status == 201
      render json: token, status: response.status
    else
      errors = Array.wrap(response.body["errors"]["error"]).join(', ')
      render json: errors, status: response.status
    end
  end
end
