require "spec_helper"

describe "CWIC Granule list", reset: false do
  extend Helpers::CollectionHelpers

  context "for all collections with granules" do
    before :all do
      Capybara.reset_sessions!
      load_page :search, env: :sit, facets: true, ff: "Int'l / Interagency", q: 'C1000003579-GCMDTEST'
      login
      wait_for_xhr
    end

    hook_granule_results("INSAT-3D Imager Level-2P IR WINDS")

    it "provides a button to get collection details", acceptance: true do
      expect(granule_list).to have_link('View collection details')
    end

    it "provides a button to get download the collection", acceptance: true do
      expect(granule_list).to have_link('Retrieve collection data')
    end

    it "provides a button to edit granule filters", acceptance: true do
      expect(granule_list).to have_link('Filter granules')
    end

    context "clicking on the collection details button", acceptance: true do
      before :all do
        granule_list.find('.master-overlay-global-actions').click_link('View collection details')
      end

      after :all do
        collection_details.click_link('Back to Granules')
      end

      it "displays the collection details", acceptance: true do
        expect(page).to have_visible_collection_details
        expect(page).to have_content('nitant@sac.isro.gov.in')
      end

      it "displays back navigation with the appropriate text", acceptance: true do
        expect(collection_details).to have_link('Back to Granules')
      end
    end

    context "clicking the exclude granule button" do
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
          load_page :search, env: :sit, facets: true, ff: "Int'l / Interagency", q: 'C1000003579-GCMDTEST'
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
      load_page :search, env: :sit, facets: true, ff: "Int'l / Interagency", q: 'C1000003579-GCMDTEST'
      login
      wait_for_xhr
    end

    context "clicking on a collection result" do
      hook_granule_results("INSAT-3D Imager Level-2P IR WINDS")

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
      load_page :search, env: :sit, facets: true, ff: "Int'l / Interagency", q: 'C1200008589-GCMDTEST'
      login
      wait_for_xhr
    end
    context "clicking on a collection result" do
      hook_granule_results("OSTM/Jason-2 Level-2 Geophysical Data Records")

      it "displays temporal information on the granule list" do
        expect(granule_list).to have_content('JA2_GPN_2PdP004_108_20080814_233038_20080815_002651.nc 2008-08-14Z to 2008-08-15Z')
      end
    end
  end

end
