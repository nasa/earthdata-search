require 'spec_helper'

describe 'User missing ordering preferences' do
  context 'when configuring a data access request', pending_updates: true do
    before :all do
      load_page :search, focus: ['C1000000739-DEV08'], env: :sit, authenticate: 'edscbasic'
      
      click_button 'Download All'
      wait_for_xhr

      find('.action-button.edit').click
      find('button', text: 'Edit Delivery Method').click
      choose 'Stage for Delivery'
      wait_for_xhr

      select 'FtpPull', from: 'Distribution Type'
      find('button', text: 'Close').click
    end

    it 'does not show an error message' do
      expect(page).to have_no_content('Contact information could not be loaded, please try again later')
    end
  end

  context 'when accessing downloadable data' do
    before :all do
      load_page :search, focus: ['C203234523-LAADS'], authenticate: 'edscbasic'

      click_button 'Download All'

      find('.action-button.edit').click
      find('button', text: 'Edit Delivery Method').click
      choose 'Direct Download'
      find('button', text: 'Close').click

      find('.button-download-data').click
    end

    it 'shows the data retrieval page' do
      expect(page).to have_content('MODIS/Aqua Calibrated Radiances 5-Min L1B Swath 1km V006')
      expect(page).to have_link('View/Download Data Links')
    end
  end
end
