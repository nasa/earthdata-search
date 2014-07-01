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
    session[:user_id] = nil
    cookies["token"] = nil
    cookies["name"] = nil

    respond_to do |format|
      format.html { redirect_to root_url }
      format.json { render json: nil, status: :ok }
    end
  end

  def new
  end

  def contact_info
  end

  def create
    user = params[:user].with_indifferent_access
    # Address needs to be converted to addresses
    address = user.delete("address")

    user[:addresses] = [address]

    if user[:password] != user[:password_confirmation]
      render json: {errors: "Password must match confirmation"}, status: 422
      return
    else
      user.delete("password_confirmation")
    end

    response = Echo::Client.create_user({user: user})
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

  def get_site_preferences
    user_id = get_user_id

    if user_id
      user = User.where(echo_id: get_user_id).first
      if user
        render json: user.site_preferences, status: :ok
      else
        render json: nil, status: :ok
      end
    else
      site_preferences = session[:site_preferences]
      render json: site_preferences, status: :ok
    end
  end

  def set_site_preferences
    user = current_user

    if user
      user.site_preferences = params[:site_preferences]
      user.save
      render json: user.site_preferences, status: :ok
    else
      session[:site_preferences] = params[:site_preferences]
      render json: session[:site_preferences], status: :ok
    end
  end
end
