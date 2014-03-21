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
                     'kbaynes'
                    ]
        authenticate_or_request_with_http_basic do |username, password|
          whitelist.include?(username) && Echo::Client.get_token(username, password, 'EDSC', request.remote_ip).success?
        end
      end
    end
end
