require 'rails_helper'

describe 'Switching Delivery Methods' do
  before do
    load_page :projects_page, project: ['C1000000739-DEV08'], env: :sit, authenticate: 'edsc'
  end

  context 'when switching between delivery methods' do
    before do
      collection_card = find('.project-list-item', match: :first)

      collection_card.find('.project-list-item-action-edit-options').click
      wait_for_xhr

      click_on 'Edit Delivery Method'
      choose('Stage for Delivery')

      select 'FTP Push', from: 'Distribution Type'

      # switch to different form
      click_on 'Edit Delivery Method'
      choose('Customize & Download')

      # switch back to original form
      click_on 'Edit Delivery Method'
      choose('Stage for Delivery')
    end

    it 'saves the form state of the previous form' do
      expect(page).to have_select('Distribution Type', selected: 'FTP Push')
    end
  end
end
