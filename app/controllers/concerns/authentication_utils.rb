module AuthenticationUtils
  extend ActiveSupport::Concern

  included do
    helper_method :store_user_data
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

  def retrieve_urs_profile(oauth_response)
    # Once we retrieve this from URS we can use the `uid` value but the oauth
    # endpoint only returns the path to the user
    username = oauth_response['endpoint'].gsub('/api/users/', '') if oauth_response['endpoint']

    byebug
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
