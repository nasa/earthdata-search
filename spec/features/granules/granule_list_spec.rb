# EDSC-56: As a user, I want to see a list of top granules matching my search so
#          that I may preview my results before retrieving data
# EDSC-58: As a user, I want to load more granules as I scroll so that I may see
#          granules that are not among my top results

require "spec_helper"

describe "Granule list", reset: false do
  extend Helpers::CollectionHelpers

  before :all do
    Capybara.reset_sessions!
    load_page :search
  end

  context "for all collections with granules" do
    use_collection 'C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)'
    hook_granule_results

    it "provides a button to get collection details" do
      expect(granule_list).to have_link('View collection details')
    end

    it "provides a button to get download the collection" do
      expect(granule_list).to have_link('Retrieve collection data')
    end

    it "provides a button to edit granule filters" do
      expect(granule_list).to have_link('Filter granules')
    end

    context "clicking on the collection details button" do
      before :all do
        granule_list.find('.master-overlay-global-actions').click_link('View collection details')
      end

      after :all do
        collection_details.click_link('Back to Granules')
      end

      it "displays the collection details" do
        expect(page).to have_visible_collection_details
        expect(page).to have_content('ornldaac@ornl.gov')
      end

      it "displays back navigation with the appropriate text" do
        expect(collection_details).to have_link('Back to Granules')
      end
    end

    context "clicking on the download button" do
      before :all do
        granule_list.find('.master-overlay-global-actions').click_link('Retrieve collection data')
      end

      after :all do
        page.execute_script('window.history.back()')
      end

      it "triggers the download workflow" do
        expect(page).to have_content('EOSDIS Earthdata Login')
      end
    end

    context "clicking on the edit filters button" do
      before :all do
        granule_list.click_link('Filter granules')
      end

      after :all do
        granule_list.click_link('Hide granule filters')
      end

      it "allows the user to edit granule filters" do
        expect(page).to have_content('Day / Night Flag')
      end

      context "and editing a filter" do
        before :all do
          select 'Day only', from: "day-night-select"
        end

        after :all do
          select 'Anytime', from: "day-night-select"
        end

        it "shows the filters in an applied state" do
          expect(granule_list).to have_selector('.button-highlighted[title="Hide granule filters"]')
        end
      end
    end

    context "clicking the exclude granule button" do
      before :all do
        first_granule_list_item.click
        first_granule_list_item.click_link "Exclude this granule"
        wait_for_xhr
      end

      after :all do
        click_link "Filter granules"
        click_button "granule-filters-clear"
        click_link 'Hide granule filters'
      end

      it "removes the selected granule from the list" do
        expect(page).to have_no_content('FIFE_STRM_15M.80611715.s15')
        expect(page).to have_css('#granule-list .panel-list-item', count: 19)
      end

      it "shows undo button to re-add the granule" do
        expect(page).to have_content("Granule excluded. Undo")
      end

      context "until all granules on current page are excluded" do
        before :all do
          num_of_clicks = 19
          while num_of_clicks > 0
            first_granule_list_item.click_link "Exclude this granule"
            num_of_clicks -= 1
            wait_for_xhr
          end
        end

        after :all do
          Capybara.reset_sessions!
          load_page :search
          fill_in 'keywords', with: 'C179003030-ORNL_DAAC'
          view_granule_results

          first_granule_list_item.click
          first_granule_list_item.click_link "Exclude this granule"
          wait_for_xhr
        end

        it "loads next page" do
          expect(page.text).to match(/Showing [1-9]\d* of 19 matching granules/)
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

        it "shows the excluded granule in the granule list" do
          expect(page).to have_content('FIFE_STRM_15M.80611715.s15')
          expect(page).to have_css('#granule-list .panel-list-item', count: 20)
        end

        it "selects the previously excluded granule" do
          expect(page).to have_css('.panel-list-list li:nth-child(1).panel-list-selected')
        end
      end

      context "and changing granule query" do
        before :all do
          click_link "Filter granules"
          check "Find only granules that have browse images."
          wait_for_xhr
        end

        after :all do
          uncheck "Find only granules that have browse images."
          click_link "Add it back"
          wait_for_xhr
          click_link 'Hide granule filters'
          first_granule_list_item.click
          first_granule_list_item.click_link "Exclude this granule"
          wait_for_xhr
        end

        it "removes the undo button" do
          expect(page).to have_no_content("Granule excluded. Undo")
        end
      end
    end
  end

  context "for collections with many granule results" do
    use_collection 'C179002914-ORNL_DAAC', '30 Minute Rainfall Data (FIFE)'

    context "clicking on a collection result" do
      hook_granule_results('30 Minute Rainfall Data (FIFE)', :each)

      it "displays the first granule results in a list that pages by 20" do
        expect(page).to have_css('#granule-list .panel-list-item', count: 20)
        page.execute_script "$('#granule-list .master-overlay-content')[0].scrollTop = 10000"
        expect(page).to have_css('#granule-list .panel-list-item', count: 40)
        expect(page).to have_no_content('Loading granules...')
      end
    end
  end

  context "for collections with few granule results" do
    use_collection 'C179003380-ORNL_DAAC', 'A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves'

    context "clicking on a collection result" do
      hook_granule_results('A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves')

      it "displays all available granule results" do
        expect(page).to have_css('#granule-list .panel-list-item', count: 2)
      end

      it "does not attempt to load additional granule results" do
        expect(page).to have_no_text("Loading granules...")
      end
    end
  end

  context "for collections without granules" do
    use_collection 'C179002107-SEDAC', 'Anthropogenic Biomes of the World, Version 1'

    context "clicking on a collection result" do
      before :all do
        expect(page).to have_visible_collection_results
        first_collection_result.click
        wait_for_xhr
      end

      it "shows no granules" do
        expect(page).to have_no_css('#granule-list .panel-list-item')
      end

      it "does not attempt to load additional granule results" do
        expect(page).to have_no_text("Loading granules...")
      end
    end
  end
end
