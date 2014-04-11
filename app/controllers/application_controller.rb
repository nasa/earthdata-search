class ApplicationController < ActionController::Base
  protect_from_forgery

  before_action :authenticate

  protected

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
                     'dawnlowe'
                    ]
        authenticate_or_request_with_http_basic do |username, password|
          whitelist.include?(username) && Echo::Client.get_token(username, password, 'EDSC', request.remote_ip).success?
        end
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
end
