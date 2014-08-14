class UsersController < ApplicationController
  def login
    session[:last_point] = request.referrer
    session[:last_point] = params[:next_point] if params[:next_point]

    redirect_to "#{ ENV['urs_root'] }oauth/authorize?client_id=#{ENV['urs_client_id'] }&redirect_uri=#{ENV['urs_callback_url'] }&response_type=code"
  end

  def logout
    session[:urs_user] = nil
    session[:access_token] = nil
    session[:refresh_token] = nil
    session[:user_id] = nil
    session[:name] = nil
    session[:expires] = nil
    session[:recent_datasets] = []

    respond_to do |format|
      format.html { redirect_to root_url }
      format.json { render json: nil, status: :ok }
    end
  end

  def refresh_token
    OauthToken.refresh_token(session[:refresh_token])
  end

  def new
  end

  def contact_info
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
