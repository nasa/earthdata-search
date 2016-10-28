require 'spec_helper'

describe 'Services Access', reset: false do
  serviceable_collection_id = 'C179014698-NSIDC_ECS'
  smap_collection_id = 'C1236303848-NSIDC_ECS'
  smap_collection_title = "SMAP L1C Radiometer Half-Orbit 36 km EASE-Grid Brightness Temperatures V003"
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
        within '.access-error-code' do
          expect(page).to have_content('CollectionDisabled')
        end
        within '.access-error-message-list' do
          expect(page).to have_content('This collection is currently not configured for subagent HEG')
        end
      end
    end
  end

  context 'when viewing data access with a SMAP collection that is capable of zone subsetting' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, focus: smap_collection_id
      login
      first_granule_list_item.click_link "Retrieve single granule data"
    end

    context "when submitting the ESI service access method for two consecutive times" do
      before :all do
        # first time, the ESI option should not be selected and the form should not be auto populated.
        expect(page).not_to have_content("Reformat Output (Optional)")
        choose 'SPL1CTB.3 ESI Service'
        wait_for_xhr
        fill_in 'Email Address', with: "patrick+edsc@element84.com\t"
        select 'NetCDF4-CF', from: 'Output File Format'
        select 'UTM Northern Hemisphere', from: 'Re-projection Options'
        fill_in 'UTM Zone', with: "3\t"
        click_on 'Continue'
        click_on 'Submit'

        # Second time, the ESI form is now prepopulated
        click_link 'Back to Data Access Options'
        wait_for_xhr
        click_on 'Continue'
        click_on 'Submit'
      end

      context 'and returning to the retrieval page after the service is complete' do
        before :all do
          visit "/data/status"
          within ".odd" do
            click_on smap_collection_title
          end
          wait_for_xhr
        end

        it 'displays the service order is completed' do
          expect(page).to have_content('Complete')
        end
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
