require "spec_helper"

describe "CWIC Granule list", reset: false do
  extend Helpers::CollectionHelpers

  context "for all collections with granules" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, env: :uat, q: 'USGS_EDC_EO1_ALI'
    end

    hook_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data")

    it "provides a button to get collection details", acceptance: true do
      expect(granule_list).to have_link('View collection details')
    end

    it "provides a button to download the collection", acceptance: true do
      expect(granule_list).to have_link('Retrieve collection data')
    end

    it "provides a button to edit granule filters", acceptance: true do
      expect(granule_list).to have_link('Filter granules')
    end

    context "clicking on the collection details button" do
      before :all do
        wait_for_xhr
        granule_list.find('.master-overlay-global-actions').click_link('View collection details')
        wait_for_xhr
      end

      after :all do
        collection_details.click_link('Back to Granules')
      end

      it "displays the collection details", acceptance: true do
        page.execute_script("console.log(' --- AND ---');")
        expect(page).to have_visible_collection_details
        expect(page).to have_content('lta@usgs.gov')
      end

      it "displays back navigation with the appropriate text", acceptance: true do
        page.execute_script("console.log(' --- AND ---');")
        expect(collection_details).to have_link('Back to Granules')
      end
    end

    # We don't currently support the exclude button for CWIC
    xit "clicking the exclude granule button" do

      before :all do
        first_granule_list_item.click
        first_granule_list_item.click_link "Exclude this granule"
        wait_for_xhr
      end

      after :all do
        click_link "Undo"
      end

      it "removes the selected granule from the list", acceptance: true do
        expect(page).to have_no_content('3DIMG_18JUL2014_0400_L2P_IRW')
        expect(page).to have_css('#granule-list .panel-list-item', count: 19)
      end

      it "shows undo button to re-add the granule", acceptance: true do
        expect(page).to have_content("Granule excluded. Undo")
      end

      context "until all granules on current page are excluded" do
        before :all do
          num_of_clicks = 9
          while num_of_clicks > 0
            first_granule_list_item.click_link "Exclude this granule"
            num_of_clicks -= 1
            wait_for_xhr
          end
        end

        after :all do
          Capybara.reset_sessions!
          load_page :search, env: :sit, facets: true, q: 'C1000003579-GCMDTEST'
          login
          wait_for_xhr
          view_granule_results("INSAT-3D Imager Level-2P IR WINDS")

          first_granule_list_item.click
          first_granule_list_item.click_link "Exclude this granule"
          wait_for_xhr
        end

        it "loads next page", acceptance: true do
          expect(page.text).to match(/Showing [0-9]\d* of \d* matching granules/)
          expect(page).to have_content("Granule excluded. Undo")
        end
      end

      context "and clicking the undo button" do
        before :all do
          click_link "Undo"
        end

        after :all do
          first_granule_list_item.click_link "Exclude this granule"
        end

        it "shows the excluded granule in the granule list", acceptance: true do
          expect(page).to have_content('3DIMG_18JUL2014_0400_L2P_IRW')
          expect(page).to have_css('#granule-list .panel-list-item', count: 20)
        end

        it "selects the previously excluded granule", acceptance: true do
          expect(page).to have_css('.panel-list-list li:nth-child(1).panel-list-selected')
        end
      end
    end
  end

  context "for collections with many granule results" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, env: :uat, q: 'USGS_EDC_EO1_ALI'
    end

    context "clicking on a collection result" do
      hook_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data")

      it "displays the first granule results in a list that pages by 20" do
        expect(page).to have_css('#granule-list .panel-list-item', count: 20)
        page.execute_script "$('#granule-list .master-overlay-content')[0].scrollTop = 10000"
        expect(page).to have_css('#granule-list .panel-list-item', count: 40)
        expect(page).to have_no_content('Loading granules...')
      end
    end
  end

  context "for collections that have granules with temporal fields" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, env: :uat, q: 'USGS_EDC_EO1_ALI'
    end

    context "clicking on a collection result" do
      hook_granule_results("EO-1 (Earth Observing-1) Advanced Land Imager (ALI) Instrument Level 1R, Level 1Gs, Level 1Gst Data")

      it "displays temporal information on the granule list" do
        expect(granule_list.text).to match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z to \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/)
      end
    end
  end

  context "for CWIC tagged collections" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, env: :uat, facets: true, q: 'C1204595275-GCMDTEST'
      view_granule_results("ACES Continuous Data")
    end

    it "displays a help button to find out more information about CWIC collections", acceptance: true do
      expect(page).to have_link("Learn More ...")
    end

    context "clicking on the CWIC help button" do
      before :all do
        click_on "Learn More ..."
        sleep 1
      end

      it "displays additional details about CWIC collections", acceptance: true do
        expect(page).to have_content "CWIC is short for CEOS WGISS Integrated Catalog"
      end
    end
  end

  context "for non-CWIC collections" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, env: :sit, q: 'C24936-LAADS'
      view_granule_results("MODIS/Terra Aerosol 5-Min L2 Swath 10km V005")
    end

    it "does not display a help button to find out more information about CWIC collections", acceptance: true do
      expect(page).not_to have_link("Learn More ...")
    end
  end
end
