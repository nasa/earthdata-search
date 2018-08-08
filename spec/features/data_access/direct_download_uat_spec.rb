require 'spec_helper'

describe 'Direct download script UAT', reset: false do
  context 'when viewing the direct download script in UAT' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, overlay: false, env: :uat
      login
      load_page 'data/configure', env: :uat, project: ['C447308-ORNL_DAAC']
      wait_for_xhr

      choose 'Direct Download'
      click_on 'Submit'
      wait_for_xhr

      click_link 'Download Access Script'
    end

    it 'displays the correct URS path' do
      within_last_window do
        expect(page.source).to have_content('machine uat.urs.earthdata.nasa.gov')
      end
    end
  end
end
