require 'rails_helper'

describe 'Data Quality Summaries' do
  # Travis is failing this test and we haven't been able to find a reason
  context 'when configuring retrieval for a collection with quality information', pending_updates: true do
    before :all do
      load_page :projects_page, project: ['C115003855-NSIDC_ECS'], authenticate: 'edsc'

      collection_card = find('.project-list-item', match: :first)
      collection_card.find('.project-list-item-action-edit-options').click
      wait_for_xhr

      click_button('Edit Delivery Method')
    end

    it 'shows data quality summaries' do
      expect(page).to have_text('Quality Information')
      expect(page).to have_text('MODIS Snow and Sea Ice Quality Assessment and Validation')
    end
  end

  context 'when configuring retrieval for a collection with no quality information' do
    before :all do
      load_page :projects_page, project: ['C179003030-ORNL_DAAC'], authenticate: 'edsc'

      collection_card = find('.project-list-item', match: :first)
      collection_card.find('.project-list-item-action-edit-options').click
      wait_for_xhr

      click_button('Edit Delivery Method')
    end

    it 'shows no data quality summaries' do
      expect(page).to have_no_text('Quality Information')
    end
  end
end
