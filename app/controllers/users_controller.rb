class UsersController < ApplicationController
  before_action :require_login, only: :contact_info

  def login
    session[:last_point] = request.referer
    session[:last_point] = params[:next_point] if params[:next_point]

    redirect_to echo_client.urs_login_path
  end

  def logout
    clear_session

    respond_to do |format|
      format.html { redirect_to edsc_path(root_url) }
      format.json { render json: nil, status: :ok }
    end
  end

  def contact_info; end

  def get_preferences
    # This method should exist within two different controllers, one for URS and one for ECHO
    echo_preferences = current_user.echo_preferences

    # TODO: This should not combine URS and ECHO data, this should be split
    # into two different objects and maintained separately
    echo_preferences['preferences']['general_contact'] = current_user.urs_profile if current_user.urs_profile.any?

    render json: current_user.echo_preferences, status: :ok
  end

  def update_notification_pref
    # params['preferences'] comes from account.js.coffee and only sets certain values
    # from the /get_preferences endpoint which just inserts the users' urs profile into
    # a hash at preferences/general_contact to match the ECHO format.
    preferences = { 'preferences' => params.delete('preferences') }
    preferences['preferences']['general_contact']['role'] = 'Order Contact'

    response = echo_client.update_preferences(get_user_id, preferences, token)

    # TODO: We should update the echo_preferences value for the user but doing so here
    # ignores the payload hydration done within account.js.coffee.
    # If the update was successful, update the preferences in the edsc database
    # current_user.update(echo_preferences: response.body) if response.success?

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
      site_preferences = cookies[:site_preferences]
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
      cookies[:site_preferences] = {
        value: params[:site_preferences].to_json,
        expires: 10.years.from_now
      }
      render json: cookies[:site_preferences], status: :ok
    end
  end
end
