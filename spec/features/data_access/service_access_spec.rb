require 'spec_helper'

describe 'Services Access', reset: false do
  serviceable_collection_id = 'C179014698-NSIDC_ECS'
  serviceable_collection_title = 'AMSR-E/Aqua 5-Day L3 Global Snow Water Equivalent EASE-Grids V002'

  context 'when viewing data access with a serviceable collection' do
    before :all do
      Capybara.reset_sessions!
      load_page :search, focus: serviceable_collection_id
      login
      click_link "Filter granules"
      click_link "Search Multiple"
      choose "Search by Local Granule ID"
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

        # this test and the one below are quite flaky.
        it 'displays a progress bar while the service is processing' do
          while page.has_content?("AMSR-E/Aqua 5-Day L3 Global Snow Water Equivalent EASE-Grids V002 Submitting")
            p 'Submitting service request... sleep .01'
            sleep 0.01
          end
          if page.has_content?("AMSR-E/Aqua 5-Day L3 Global Snow Water Equivalent EASE-Grids V002 Processing")
            expect(page).to have_content('of 12 items processed')
            expect(page).to have_css('div.progress-bar')
          else
            expect(page).to have_content("AMSR-E/Aqua 5-Day L3 Global Snow Water Equivalent EASE-Grids V002 Complete")
          end

          # after waiting the progress bar moves
          sleep 10
          expect(page).to have_content('Complete')
          expect(page).to have_no_css('div.progress-bar')
        end

        context 'when returning to the retrieval page after a service is complete' do
          before :all do
            visit "/data/status"
            click_on serviceable_collection_title
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
