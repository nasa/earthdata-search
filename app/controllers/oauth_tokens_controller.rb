class OauthTokensController < ApplicationController
  def urs_callback
    if params[:code]
      auth_code = params[:code]
      token = OauthToken.get_oauth_tokens(auth_code)
      session[:urs_user] = token
      session[:access_token] = token["access_token"]
      session[:refresh_token] = token["refresh_token"]
      session[:expires] = token['expires']
      session[:name] = token["username"]
    end

    redirect_to redirect_from_urs
  end

  def refresh_token
    json = OauthToken.refresh_token(session[:refresh_token])

    if json
      clear_session
      session[:urs_user] = json

      session[:access_token] = json["access_token"]
      session[:refresh_token] = json["refresh_token"]
      session[:expires] = json['expires']
      session[:name] = json["username"]

      render json: {username: json['username'], expires: json['expires']}
    else
      render json: nil
    end
  end
end
