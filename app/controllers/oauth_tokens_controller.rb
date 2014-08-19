class OauthTokensController < ApplicationController
  def urs_callback
    if params[:code]
      auth_code = params[:code]
      token = OauthToken.get_oauth_tokens(auth_code)
      session[:urs_user] = token
      session[:access_token] = token["access_token"]
      session[:refresh_token] = token["refresh_token"]
      session[:expires] = token['expires']
      session[:username] = token["username"]

      # useful when needing to replace the application.yml tokens
      # puts "Token: #{token.inspect}"
    end

    redirect_to redirect_from_urs
  end

  def refresh_token
    json = refresh_urs_token

    if json
      render json: {username: json['username'], expires: json['expires']}
    else
      render json: nil
    end
  end
end
