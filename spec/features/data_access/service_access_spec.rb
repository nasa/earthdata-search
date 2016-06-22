require 'spec_helper'

describe 'Services Access', reset: false do
  serviceable_collection_id = 'C179014698-NSIDC_ECS'
  serviceable_collection_title = 'AMSR-E/Aqua 5-Day L3 Global Snow Water Equivalent EASE-Grids V002'
  disabled_serviceable_collection_id = 'C128599377-NSIDC_ECS'

  context 'when viewing data access with a collection that is not configured for ESI processing' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, focus: disabled_serviceable_collection_id
      login
      first_granule_list_item.click_link "Retrieve single granule data"
      wait_for_xhr
    end

    context 'and submitting an ESI service request' do
      before :all do
        choose 'AE_Land.2 ESI Service'
        wait_for_xhr
        fill_in 'Email Address', with: "patrick+edsc@element84.com\t"
        click_on 'Continue'
        click_on 'Submit'
      end

      # Cannot reliably display a progress bar using recordings
      it 'displays an error message', pending_fixtures: true do
        wait_for_xhr
        expect(page).to have_content('Error: CollectionDisabled')
        expect(page).to have_content('Message: This collection is currently not configured for subagent HEG')
      end
    end
  end

  context 'when viewing data access with a serviceable collection' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, focus: serviceable_collection_id
      login
      click_link "Filter granules"
      click_link "Search Multiple"
      fill_in "granule_id_field", with: "AMSR_E_L3_5DaySnow_V10_20110928.hdf\nAMSR_E_L3_5DaySnow_V10_20110923.hdf\nAMSR_E_L3_5DaySnow_V10_20110918.hdf\nAMSR_E_L3_5DaySnow_V10_20110913.hdf\nAMSR_E_L3_5DaySnow_V10_20110908.hdf\nAMSR_E_L3_5DaySnow_V10_20110903.hdf\nAMSR_E_L3_5DaySnow_V10_20110829.hdf\nAMSR_E_L3_5DaySnow_V10_20110824.hdf\nAMSR_E_L3_5DaySnow_V10_20110819.hdf\nAMSR_E_L3_5DaySnow_V10_20110814.hdf\nAMSR_E_L3_5DaySnow_V10_20110809.hdf\nAMSR_E_L3_5DaySnow_V10_20110804.hdf"
      click_button "granule-filters-submit"
      wait_for_xhr

      click_link "Retrieve collection data"
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

        it 'displays a progress bar while the service is processing', pending_fixtures: true do
          synchronize(120) do
            expect(page).to have_content("Processing") unless page.has_content?("Complete")
          end
        end

        context 'when returning to the retrieval page after a service is complete' do
          before :all do
            visit "/data/status"
            click_on serviceable_collection_title
            wait_for_xhr
          end

          it 'displays download urls', pending_fixtures: true do
            expect(page).to have_content('Complete')
          end
        end
      end
    end
  end
end
