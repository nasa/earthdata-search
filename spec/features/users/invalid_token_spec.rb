require 'spec_helper'

describe 'Invalid user token', reset: false do
  before :all do
    Capybara.reset_session!
  end

  context 'Making an ECHO request with an invalid token' do
    before :all do
      be_logged_in_as 'edsc'
      page.set_rack_session(access_token: 'invalid')

      load_page :search

      fill_in 'keywords', with: 'C179002986-ORNL_DAAC'
      wait_for_xhr
    end

    it 'logs out the user' do
      expect(page).to have_content 'Earthdata Login'
    end

    it 'displays search results' do
      expect(page).to have_content '15 Minute Stream Flow Data: USGS (FIFE)'
    end
  end

end
