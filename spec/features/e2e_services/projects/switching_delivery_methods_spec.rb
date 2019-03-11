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

      choose('Stage for Delivery')

      select 'FTP Push', from: 'Distribution Type'

      # switch to different form
      choose('Customize')

      # switch back to original form
      choose('Stage for Delivery')
    end

    it 'saves the form state of the previous form' do
      expect(page).to have_select('Distribution Type', selected: 'FTP Push')
    end
  end
end
