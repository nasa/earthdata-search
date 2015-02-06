class SearchController < ApplicationController

  before_filter :set_env_session

  def index
    @preferences = preferences
    @preferences ||= {}
    if Rails.env.sit? || Rails.env.uat? || test_splash_page
      show_splash = @preferences['show_splash'] != 'false'

      if show_splash
        if request.referrer.present? && request.referrer.start_with?('https://search.sit.earthdata.nasa.gov/', 'https://search.uat.earthdata.nasa.gov/')
          @preferences['show_splash'] = 'false'
          save_preferences(@preferences)
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

  def save_preferences(new_preferences)
    user_id = get_user_id

    if user_id
      user = User.where(echo_id: user_id).first_or_create
      user.site_preferences = new_preferences
      user.save
    else
      session[:site_preferences] = new_preferences
    end
  end

  # Allows specs to stub method to force splash screen
  def test_splash_page
    false
  end
end
