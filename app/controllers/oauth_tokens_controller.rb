class OauthTokensController < ApplicationController
  def urs_callback
    if params[:code]
      auth_code = params[:code]
      token = OauthToken.get_oauth_tokens(auth_code)
      session[:urs_user] = token
      puts token.inspect
    else
      puts params.inspect
      # { access_token: [a-f0-9]+, token_type: Bearer, expires_in: 3600, refresh_token: [a-f0-9]+, endpoint: /api/users/user_name }
    end

    redirect_to redirect_from_urs
  end
end
