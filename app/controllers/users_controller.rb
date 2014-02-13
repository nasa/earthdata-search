class UsersController < ApplicationController
  def login
    username = params[:username]
    password = params[:password]

    token = params['token']
    token['user_ip_address'] = request.remote_ip

    response = Echo::Client.get_token(token['username'], token['password'], token['client_id'], token['user_ip_address'])

    render json: response.body, status: response.status
  end
end
