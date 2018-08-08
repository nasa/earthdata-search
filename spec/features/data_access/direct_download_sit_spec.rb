require 'spec_helper'

describe 'Direct download script SIT', reset: false do
  context 'when viewing the direct download script in SIT' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, overlay: false, env: :sit
      login
      load_page 'data/configure', env: :sit, project: ['C24933-LAADS']
      wait_for_xhr

      choose 'Direct Download'
      click_on 'Submit'
      wait_for_xhr

      click_link 'Download Access Script'
    end

    it 'displays the correct URS path' do
      within_last_window do
        expect(page.source).to have_content('machine sit.urs.earthdata.nasa.gov')
      end
    end
  end
end
