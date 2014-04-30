class SearchController < ApplicationController

  def index
    if request.referrer == nil && !token.nil?
      response = Echo::Client.token_expires_soon(token)
      if response.body["token_expires_soon"]["expires_soon"] == true
        session[:token] = nil
        session[:user_id] = nil
        cookies['token'] = nil
        cookies['name'] = nil
      end
    end
  end

end
