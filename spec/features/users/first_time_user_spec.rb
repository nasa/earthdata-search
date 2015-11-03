# EDSC-614
# Fake a brand new user hitting SIT or UAT and saving splash screen preferences
# Should create the new user in the database

require 'spec_helper'

describe 'First time user' do
  context 'when saving preferences after viewing the splash screen' do
    before :each do
      SearchController.any_instance.stub(:get_user_id).and_return('test_user_id')
      SearchController.any_instance.stub(:test_splash_page).and_return(true)
      Capybara.current_session.driver.header 'Referer', 'https://search.sit.earthdata.nasa.gov/'
      visit '/'
    end

    it 'saves the preferences and shows the landing page', intermittent: 1 do
      expect(User.count).to eq(1)
      expect(page).to have_content('Browse Collections')
    end
  end
end
