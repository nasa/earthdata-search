class OauthTokensController < ApplicationController
  def urs_callback
    if params[:code]
      auth_code = params[:code]
      token = OauthToken.get_oauth_tokens(auth_code)

      store_oauth_token(token)
      # useful when needing to replace the application.yml tokens
      #Rails.logger.info "Token: #{token.inspect}"
    end

    redirect_to redirect_from_urs
  end

  def refresh_token
    json = refresh_urs_token

    if json
      render json: {tokenExpiresIn: script_session_expires_in}
    else
      render json: nil
    end
  end
end
