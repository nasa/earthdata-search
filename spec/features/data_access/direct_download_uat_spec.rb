require 'rails_helper'

describe 'Direct download script UAT' do
  context 'when viewing the direct download script in UAT' do
    before :all do
      load_page :projects_page, env: :uat, project: ['C1216127793-EDF_OPS'], authenticate: 'edsc'

      collection_card = find('.project-list-item', match: :first)
      collection_card.find('.project-list-item-action-edit-options').click
      wait_for_xhr

      click_button('Edit Delivery Method')

      choose('Direct Download')

      page.find_button('Download Data', disabled: false).click
      wait_for_xhr

      @uat_script_window = window_opened_by do
        click_link 'Download Access Script'
      end
    end

    it 'displays the correct URS path' do
      within_window(@uat_script_window) do
        expect(page.source).to have_content('machine uat.urs.earthdata.nasa.gov')
      end
    end
  end
end
