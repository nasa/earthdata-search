class SearchController < ApplicationController

  def index
    @preferences = preferences
    if request.referrer == nil && token && !token.empty?
      response = Echo::Client.token_expires_soon(token)
      if !response.success? || response.body["token_expires_soon"]["expires_soon"] == true
        cookies['token'] = nil
        cookies['name'] = nil
      end
    end
  end

  private

  def preferences
    user_id = get_user_id

    if user_id
      user = User.where(echo_id: user_id).first
      user && user.site_preferences
    else
      session[:site_preferences]
    end
  end
end
