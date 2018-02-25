require 'spec_helper'

describe 'Data Access workflow', reset: false do
  context 'When the user is logged out' do
    before(:all) do
      Capybara.reset_sessions!
      load_page :search, project: ['C194001241-LPDAAC_ECS'], view: :project
      
      click_button 'Download project data'
      wait_for_xhr
    end

    it 'forces the user to login before showing data access page' do
      expect(page).to have_content('EOSDIS Earthdata Login')
    end
  end
end
