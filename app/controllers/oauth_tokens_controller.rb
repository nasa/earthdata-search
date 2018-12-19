class OauthTokensController < ApplicationController
  def urs_callback
    if params[:code]
      auth_code = params[:code]
      response = echo_client.get_oauth_tokens(auth_code)

      if response.success?
        store_oauth_token(response.body)
        current_user.contact_information = retrieve_preferences
        current_user.save
      else
        Rails.logger.error("Oauth error: #{response.body}")
      end
      # useful when needing to replace the application.yml tokens
      # Rails.logger.info "Token: #{response.body.inspect}"
    end

    redirect_to redirect_from_urs
  end

  def refresh_token
    json = refresh_urs_token

    if json
      render json: { tokenExpiresIn: script_session_expires_in }
    else
      render json: nil, status: 401
    end
  end

  protected

  def retrieve_preferences
    preferences_response = echo_client.get_preferences(get_user_id, token, echo_client, session[:access_token])

    urs_response = echo_client.get_urs_user(session[:user_name], session[:access_token])

    if urs_response.status == 200
      if preferences_response.body['preferences']
        preferences_response.body['preferences']['general_contact'] = urs_response.body
      else
        preferences_response.body['preferences'] = {'general_contact' => urs_response.body}
      end

      preferences_response.body
    end
  end
end
