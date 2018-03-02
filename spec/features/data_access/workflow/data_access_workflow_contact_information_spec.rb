require 'spec_helper'

describe 'Data Access workflow', reset: false do
  context 'When choosing a collection that supports State for Delivery' do
    before :all do
      load_page :search, project: ['C1358859924-ORNL_DAAC'], view: :project
      login

      click_button 'Download project data'
      wait_for_xhr
    end

    it 'displays 1 configuration panel' do
      within '.data-access-content' do
        expect(page).to have_css('.access-item', count: 1)
      end
    end

    context 'When selecting the State for Delivery Access method' do
      before(:all) do
        choose 'Stage for Delivery'
        click_button 'Continue'
      end

      it 'adds an addition configuration panel for contact information' do
        within '.data-access-content' do
          expect(page).to have_css('.access-item', count: 2)
        end
      end

      it 'displays the contact information panel' do
        expect(page).to have_css('.access-item-header', text: 'Contact Information & Submit')
      end

      it 'displays current contact information' do
        within '.account-form' do
          expect(page).to have_text('Earthdata Search (patrick+edsc@element84.com)')
          expect(page).to have_text('Organization: EDSC')
          expect(page).to have_text('Country: United States')
          expect(page).to have_text('Affiliation: OTHER')
          expect(page).to have_text('Study Area: OTHER')
          expect(page).to have_text('User Type: PRODUCTION_USER')
        end
      end

      it 'includes a button to edit your profile' do
        within '.account-form' do
          expect(page).to have_link('Edit Profile in Earthdata Login')
        end
      end

      it 'displays a submit button to submit the order' do
        within '.access-item-actions' do
          expect(page).to have_button('Submit')
        end
      end
    end
  end
end
