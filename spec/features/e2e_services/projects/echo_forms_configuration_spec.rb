require 'spec_helper'

describe 'When viewing the project page with an EGI supported collection', reset: false do
  before :all do
    load_page :search, project: ['C1000000969-DEV08'], env: :sit

    login
    wait_for_xhr

    click_link('My Project')
    wait_for_xhr
  end

  context 'When choosing to customize the collection' do
    before :all do
      collection_card = find('.collection-card', match: :first)

      collection_card.find('.edit').click
    end

    it 'displays the customization modal' do
      within '.collection-customization .modal-header' do
        expect(page).to have_content('Edit Options')
      end
    end

    it 'displays the correct delivery method header' do
      within 'h4.customization-item-heading' do
        expect(page).to have_content('Customize & Download')
      end
    end

    it 'displays the variable selection option within the modal' do
      within '.collection-customization .modal-body' do
        expect(page).to have_css('.access-form')
      end
    end
  end
end
