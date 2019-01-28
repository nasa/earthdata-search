class OauthTokensController < ApplicationController
  def urs_callback
    if params[:code]
      oauth_response = echo_client.get_oauth_tokens(params[:code])

      if oauth_response.success?
        store_oauth_token(oauth_response.body)

        store_user_data(oauth_response.body)
      else
        Rails.logger.error("URS OAuth Error: #{oauth_response.body}")
      end

      # useful when needing to replace the application.yml tokens
      # Rails.logger.info "Token: #{oauth_response.body.inspect}"
    end

    redirect_to redirect_from_urs
  end

  def refresh_token
    json = refresh_urs_token

    if json
      render json: { tokenExpiresIn: script_session_expires_in }
    else
      render json: nil, status: :unauthorized
    end
  end

  def store_user_data(oauth_response)
    # session[:echo_id] is used to lookup the user in the edsc database
    # so we need to make this call first and set it in the session before calling `current_user`
    echo_profile = retrieve_echo_profile
    session[:echo_id] = echo_profile.fetch('user', {})['id']

    current_user.urs_profile      = retrieve_urs_profile(oauth_response)
    current_user.echo_profile     = echo_profile
    current_user.echo_preferences = retrieve_echo_preferences

    current_user.save
  end

  protected
  
  def retrieve_urs_profile(oauth_response)
    # Once we retrieve this from URS we can use the `uid` value but the oauth
    # endpoint only returns the path to the user
    username = oauth_response['endpoint'].gsub('/api/users/', '') if oauth_response['endpoint']

    response = echo_client.get_urs_user(username, token)
    if response.success?
      response.body
    else
      {}
    end
  end

  def retrieve_echo_profile
    response = echo_client.get_current_user(token)
    if response.success?
      response.body
    else
      {}
    end
  end

  def retrieve_echo_preferences
    # This method requires a valid response be stored in the current users' `echo_profile` column
    response = echo_client.get_preferences(get_user_id, token)
    if response.success?
      response.body
    else
      {}
    end
  end

end
