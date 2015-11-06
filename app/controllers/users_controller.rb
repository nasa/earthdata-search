class UsersController < ApplicationController
  before_filter :require_login, only: [:contact_info]

  def login
    session[:last_point] = request.referrer
    session[:last_point] = params[:next_point] if params[:next_point]

    redirect_to echo_client.urs_login_path
  end

  def logout
    clear_session

    respond_to do |format|
      format.html { redirect_to root_url }
      format.json { render json: nil, status: :ok }
    end
  end

  def contact_info
  end

  def get_preferences
    response = echo_client.get_preferences(get_user_id, token)
    user = echo_client.get_urs_user(session[:user_name], session[:access_token]).body
    Rails.logger.info "--------- user: #{user.inspect}"
    response.body['preferences']['general_contact'] = user
    Rails.logger.info "--------- response: #{response.body}"

    render json: response.body, status: response.status
  end

  def update_contact_info
    preferences = {preferences: params.delete('preferences')}
    user_id = get_user_id

    response = echo_client.update_preferences(user_id, preferences, token)
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
