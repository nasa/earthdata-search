require 'rails_helper'

describe 'Data Quality Summaries' do
  context 'when configuring retrieval for a collection with quality information' do
    before :all do
      load_page :search, project: ['C115003855-NSIDC_ECS'], authenticate: 'edsc'
      click_link('My Project')
      wait_for_xhr

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
      load_page :search, project: ['C179003030-ORNL_DAAC'], authenticate: 'edsc'
      click_link('My Project')
      wait_for_xhr

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
