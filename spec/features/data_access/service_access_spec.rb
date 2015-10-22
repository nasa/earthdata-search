require 'spec_helper'

describe 'Services Access', reset: false do
  serviceable_dataset_id = 'C179014698-NSIDC_ECS'
  serviceable_dataset_title = 'AMSR-E/Aqua 5-Day L3 Global Snow Water Equivalent EASE-Grids V002'

  context 'when viewing data access with a serviceable dataset' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, focus: serviceable_dataset_id
      login
      first_granule_list_item.click_link "Retrieve single granule data"
      wait_for_xhr
    end

    it 'displays a service access method' do
      expect(page).to have_content('AE_5DSno.2 ESI Service')
    end

    context 'when selecting the service access method' do
      before :all do
        choose 'AE_5DSno.2 ESI Service'
      end

      it 'displays the service echoform' do
        expect(page).to have_field('Email Address')
        expect(page).to have_content('Reformat Output (Optional)')
      end

      context 'when submitting a service request' do
        before :all do
          fill_in 'Email Address', with: "patrick+edsc@element84.com\t"
          click_on 'Continue'
          click_on 'Submit'
        end

        it 'displays a progress bar while the service is processing' do
          expect(page).to have_content('Progress: 0 of 1 items processed (0.00%)')
          expect(page).to have_css('div.progress-bar')

          # after waiting the progress bar moves
          sleep 10
          expect(page).to have_content('Complete')
          expect(page).to have_no_css('div.progress-bar')
        end

        context 'when returning to the retrieval page after a service is complete' do
          before :all do
            visit "/data/status"
            click_on serviceable_dataset_title
            wait_for_xhr
          end

          it 'displays download urls' do
            expect(page).to have_content('Complete')
          end
        end
      end
    end
  end
end
