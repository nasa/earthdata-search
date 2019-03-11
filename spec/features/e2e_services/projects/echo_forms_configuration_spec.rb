require 'rails_helper'

describe 'When viewing the project page with an EGI supported collection' do
  before :all do
    load_page :projects_page, project: ['C1000000969-DEV08'], env: :sit, authenticate: 'edsc'
  end

  context 'When choosing to edit the collection' do
    before :all do
      collection_card = find('.project-list-item', match: :first)

      collection_card.find('.project-list-item-action-edit-options').click
      wait_for_xhr

      choose 'Stage for Delivery'
    end

    it 'displays the customization panel' do
      expect(page).to have_content('Edit Options')
    end

    it 'displays the correct delivery method' do
      within '.radio-list' do
        field = find_field('C1000000969-DEV08-00-access-method')
        field_parent = field.find(:xpath, '..')
        expect(field).to be_checked
        expect(field_parent).to have_content('Stage for Delivery')
      end
    end

    it 'displays the variable selection option within the modal' do
      expect(page).to have_css('.access-form')
    end

    context 'when selecting the Customize delivery option' do
      before do
        choose('Customize')
      end

      it 'prepopulates the form email address' do
        expect(page).to have_field('Email Address', with: 'patrick+edsc@element84.com')
      end
    end
  end
end
