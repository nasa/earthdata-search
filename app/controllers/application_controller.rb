class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from Faraday::Error::TimeoutError, with: :handle_timeout

  protected

  def handle_timeout
    Rails.logger.error 'Request timed out'
    if request.xhr?
      render json: {errors: {error: 'The server took too long to complete the request'}}, status: 504
    end
  end

  def token
    cookies['token']
  end

  def get_user_id
    # Dont make a call to ECHO if we already know the user id
    return session[:user_id] if session[:user_id]

    # Dont make a call to ECHO if user is not logged in
    return nil unless token.present?

    response = Echo::Client.get_token_info(token).body
    session[:user_id] = response["token_info"]["user_guid"] if response["token_info"]
    session[:user_id]
  end

  def current_user
    user_id = get_user_id
    @current_user ||= User.find_or_create_by(echo_id: user_id) if user_id.present?
    @current_user
  end
end
