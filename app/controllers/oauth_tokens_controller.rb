class OauthTokensController < ApplicationController
  include AuthenticationUtils

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
end
