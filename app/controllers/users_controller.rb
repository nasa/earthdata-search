class UsersController < ApplicationController
  def login
    token = params['token']
    token['user_ip_address'] = request.remote_ip

    response = Echo::Client.get_token(token['username'], token['password'], token['client_id'], token['user_ip_address'])

    session[:token] = response.body["token"] if response.body["token"]

    render json: response.body, status: response.status
  end

  def username_recall
    response = Echo::Client.username_recall(params.slice(:email))
    render json: response.body, status: response.status
  end

  def password_reset
    response = Echo::Client.password_reset(params.slice(:username, :email))
    render json: response.body, status: response.status
  end

  def logout
    session[:token] = nil

    render json: nil, status: :ok
  end

  def new
  end
  def contact_info
  end

  def create
    # Address needs to be converted to addresses
    address = params[:user].delete("address")

    params[:user][:addresses] = [address]

    if params[:user][:password] != params[:user][:password_confirmation]
      render json: {errors: "Password must match confirmation"}, status: 422
      return
    else
      params[:user].delete("password_confirmation")
    end

    response = Echo::Client.create_user({user: params[:user]})
    render json: response.body, status: response.status
  end

  def get_preferences
    response = Echo::Client.get_preferences(get_user_id, token)
    render json: response.body, status: response.status
  end

  def update_contact_info
    preferences = {preferences: params.delete('preferences')}
    user_id = get_user_id

    response = Echo::Client.update_preferences(user_id, preferences, token)
    render json: response.body, status: response.status
  end
end
