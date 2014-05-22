class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from Faraday::Error::TimeoutError, with: :handle_timeout

  before_action :authenticate

  protected

  def handle_timeout
    Rails.logger.error 'Request timed out'
    if request.xhr?
      render json: {errors: {error: 'The server took too long to complete the request'}}, status: 504
    end
  end

  def authenticate
    if Rails.env.production? || Rails.env.ops? || Rails.env.uat? || Rails.env.sit?
      whitelist = [
                   'pquinn',
                   'dpilone',
                   'aemitchel',
                   'arthurcohen',
                   'nakamura8402',
                   'kjmurphy',
                   'jsiarto',
                   'cdurbin',
                   'bmclaughlin',
                   'macrouch',
                   'jgilman',
                   'kbaynes',
                   'mcechini',
                   'jbehnke',
                   'rboller',
                   'dawnlowe',
                   'dnewman'
                  ]
      authenticate_or_request_with_http_basic do |username, password|
        whitelist.include?(username) && authenticate_token(username, password)
      end
    end
  end

  # This is only used to avoid a POST to ECHO every time a
  # request comes in while the app is still whitelisted
  # TODO: Remove after the app is no longer whitelisted!
  def authenticate_token(username, password)
    unless session[:authenticate_token]
      session[:authenticate_token] = Echo::Client.get_token(username, password, 'EDSC', request.remote_ip).body["token"]["id"]
    end

    session[:authenticate_token]
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
end
