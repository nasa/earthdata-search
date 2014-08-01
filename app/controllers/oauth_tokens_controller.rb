class OauthTokensController < ApplicationController
  def urs_callback
    if params[:code]
      puts "CODE"
      puts params[:code].inspect
      auth_code = params[:code]
      token = OauthToken.get_oauth_tokens(auth_code)
      session[:urs_user] = token
      session[:access_token] = token["access_token"]
      session[:refresh_token] = token["refresh_token"]
      session[:expires] = token['expires']
      session[:name] = token["username"]
      puts token.inspect
    else
      puts params.inspect
      # { access_token: [a-f0-9]+, token_type: Bearer, expires_in: 3600, refresh_token: [a-f0-9]+, endpoint: /api/users/user_name }
    end

    redirect_to redirect_from_urs
  end

  def refresh_token
    json = OauthToken.refresh_token(session[:refresh_token])

    if json
      5.times do
        puts '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
        puts ''
      end

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
