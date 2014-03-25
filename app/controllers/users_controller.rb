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

  def create
    # Country needs to be converted to addresses
    country = params[:user][:country]
    params[:user].delete("country")
    params[:user][:addresses] = [{country: country}]

    if params[:user][:password] != params[:user][:password_confirmation]
      render json: {errors: "Password must match confirmation"}, status: 422
      return
    else
      params[:user].delete("password_confirmation")
    end

    response = Echo::Client.create_user({user: params[:user]})
    render json: response.body, status: response.status
  end
end
