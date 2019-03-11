require 'rails_helper'

describe 'User missing ordering preferences' do
  context 'when configuring a data access request' do
    before :all do
      load_page :search, focus: ['C1000000739-DEV08'], env: :sit, authenticate: 'edscbasic'

      click_button 'Download All'
      wait_for_xhr

      collection_card = find('.project-list-item', match: :first)
      collection_card.find('.project-list-item-action-edit-options').click
      wait_for_xhr

      choose 'Stage for Delivery'
      wait_for_xhr

      select 'FTP Pull', from: 'Distribution Type'
    end

    it 'does not show an error message' do
      expect(page).to have_no_content('Contact information could not be loaded, please try again later')
    end
  end

  context 'when accessing downloadable data' do
    before :all do
      load_page :search, focus: ['C179003620-ORNL_DAAC'], authenticate: 'edscbasic'

      click_button 'Download All'

      find('.button-download-data').click
    end

    it 'shows the data retrieval page' do
      expect(page).to have_content('Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050')
      expect(page).to have_link('View/Download Data Links')
    end
  end
end
