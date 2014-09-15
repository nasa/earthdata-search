class SearchController < ApplicationController

  before_filter :set_env_session

  def index
    @preferences = preferences
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
