require 'spec_helper'

describe 'Direct download script SIT', reset: false do
  context 'when viewing the direct download script in SIT' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, overlay: false, env: :sit
      
      login

      load_page 'projects/new', env: :sit, project: ['C1000000082-EDF_OPS']
      wait_for_xhr

      page.find('.button-download-data').click
      wait_for_xhr

      @sit_script_window = window_opened_by do
        click_link 'Download Access Script'
      end
    end

    it 'displays the correct URS path' do
      within_window(@sit_script_window) do
        expect(page.source).to have_content('machine sit.urs.earthdata.nasa.gov')
      end
    end
  end
end
