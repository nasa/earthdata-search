class SearchController < ApplicationController

  before_filter :set_env_session

  def index
    @preferences = preferences
    env_name = Rails.configuration.env_name
    if env_name == '[SIT]' || env_name == '[UAT]'
      referrer = request.referrer
      show_splash = @preferences.nil? ? true : @preferences['show_splash'] != 'false'

      if show_splash
        if referrer == 'https://search.sit.earthdata.nasa.gov/' ||
            referrer == 'https://search.uat.earthdata.nasa.gov/'
          @preferences['show_splash'] = 'false'
          session[:site_preferences] = @preferences
        else
          render 'splash', layout: false
        end
      end
    end
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
