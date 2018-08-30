require 'spec_helper'

describe 'User missing ordering preferences', reset: false, pending_updates: true do
  collection_id = 'C203234523-LAADS'
  collection_title = 'MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 1km V006'

  context 'when configuring a data access request' do
    before :all do
      load_page :search, focus: [collection_id]
      
      login 'edscbasic'
      wait_for_xhr

      click_button 'Download All'
      wait_for_xhr

      choose 'Stage for Delivery'
      wait_for_xhr
      select 'FtpPull', from: 'Distribution Options'
      click_button 'Continue'
    end

    it 'does not show an error message' do
      expect(page).to have_no_content('Contact information could not be loaded, please try again later')
    end
  end

  context 'when accessing downloadable data' do
    before :all do
      load_page :search, focus: [collection_id]
      
      login 'edscbasic'
      wait_for_xhr

      click_button 'Download All'
      wait_for_xhr

      choose 'Direct Download'

      click_button 'Submit'
    end

    it 'shows the data retrieval page' do
      expect(page).to have_content(collection_title)
      expect(page).to have_link('View/Download Data Links')
    end
  end
end
