class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :urs_user, except: [:logout]

  rescue_from Faraday::Error::TimeoutError, with: :handle_timeout

  def redirect_from_urs
    last_point = session[:last_point]
    session[:last_point] = nil
    last_point || root_url
  end

  protected

  def urs_user
    puts 'cookies  ' + cookies['expires'].inspect
    puts Time.now.to_i * 1000
    puts cookies['expires'].to_i
    OauthToken.refresh_token(cookies['refresh_token']) if cookies['expires'].to_i > 0 && (Time.now.to_i * 1000) > cookies['expires'].to_i
    @urs_user = session[:urs_user]
    session[:urs_user] = nil
  end

  def handle_timeout
    Rails.logger.error 'Request timed out'
    if request.xhr?
      render json: {errors: {error: 'The server took too long to complete the request'}}, status: 504
    end
  end

  def token
    cookies['access_token']
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

  @@user_lock = Mutex.new
  def current_user
    if @current_user.nil?
      user_id = get_user_id
      if user_id.present?
        @@user_lock.synchronize do
          @current_user = User.find_or_create_by(echo_id: user_id)
        end
      end
    end
    @current_user
  end
end
