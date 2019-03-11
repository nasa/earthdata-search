require 'rails_helper'

describe 'Invalid Delivery Options' do
  before do
    load_page :projects_page, project: ['C1000000739-DEV08'], env: :sit, authenticate: 'edsc'
  end

  context 'when viewing a project with invalid data in the selected delivery option' do
    before do
      collection_card = find('.project-list-item', match: :first)

      collection_card.find('.project-list-item-action-edit-options').click
      wait_for_xhr

      choose('Customize')

      fill_in 'Email Address', with: ''
    end

    it 'does not allow data download' do
      collection_card = find('.project-list-item', match: :first)
      within collection_card do
        expect(page).to have_css('.fa.fa-exclamation-circle.echoforms-error')
      end

      within '.master-overlay-footer-actions' do
        expect(page).to have_content('One or more collections in your project contains customization errors. Please click "Edit Options" to fix the errors before downloading.')
        expect(page).to have_css('.button-download-data.button-disabled')
      end
    end

    context 'when correcting the invalid form' do
      before do
        fill_in 'Email Address', with: "test@example.com\t"
      end

      it 'allows data download' do
        collection_card = find('.project-list-item', match: :first)
        within collection_card do
          expect(page).to have_no_css('.fa.fa-exclamation-circle.echoforms-error')
        end

        within '.master-overlay-footer-actions' do
          expect(page).to have_content('Click "Edit Options" above to customize the output for each project.')
          expect(page).to have_no_css('.button-download-data.button-disabled')
        end
      end
    end
  end

  context 'when viewing a project with a valid delivery option' do
    before do
      collection_card = find('.project-list-item', match: :first)

      collection_card.find('.project-list-item-action-edit-options').click
      wait_for_xhr

      choose('Direct Download')
    end

    it 'allows data download' do
      collection_card = find('.project-list-item', match: :first)
      within collection_card do
        expect(page).to have_no_css('.fa.fa-exclamation-circle.echoforms-error')
      end

      within '.master-overlay-footer-actions' do
        expect(page).to have_content('Click "Edit Options" above to customize the output for each project.')
        expect(page).to have_no_css('.button-download-data.button-disabled')
      end
    end
  end
end
