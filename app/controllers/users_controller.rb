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

  def get_contact_info
    response = Echo::Client.get_contact_info(get_user_id, token)
    render json: response.body, status: response.status
  end

  def get_phones
    response = Echo::Client.get_phones(params[:user_id], token)
    render json: response.body, status: response.status
  end

  def get_preferences
    response = Echo::Client.get_preferences(params[:user_id], token)
    render json: response.body, status: response.status
  end

  def update_contact_info
    user = {user: params.delete('user')}
    phones = [user[:user].delete("phone"), user[:user].delete("fax")]
    preferences = {
      preferences: {
        order_notification_level: user[:user].delete("preferences")
      }
    }
    user_id = get_user_id

    addresses = user[:user].delete('addresses')
    user[:user][:addresses] = [addresses]
    user[:user][:id] = user_id

    contact_info_response = Echo::Client.update_contact_info(user_id, user, token)

    preference_response = Echo::Client.update_preferences(user_id, preferences, token)

    phones_response = nil
    phones.each do |phone|
      p = {
        phone: phone
      }
      phones_response = Echo::Client.update_phones(user_id, p, token)
    end

    puts contact_info_response.body.inspect
    puts preference_response.body.inspect
    puts phones_response.body.inspect

    render json: phones_response.body, status: phones_response.status
  end
end
