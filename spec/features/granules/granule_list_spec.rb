# EDSC-56: As a user, I want to see a list of top granules matching my search so
#          that I may preview my results before retrieving data
# EDSC-58: As a user, I want to load more granules as I scroll so that I may see
#          granules that are not among my top results

require "spec_helper"

describe "Granule list", reset: false do
  extend Helpers::DatasetHelpers

  before :all do
    Capybara.reset_sessions!
    load_page :search
  end

  context "for all datasets with granules" do
    use_dataset 'C14758250-LPDAAC_ECS', 'ASTER L1A'
    hook_granule_results

    it "provides a button to get dataset details" do
      expect(granule_list).to have_link('View details')
    end

    it "provides a button to get download the dataset" do
      expect(granule_list).to have_link('Retrieve data')
    end

    it "provides a button to edit granule filters" do
      expect(granule_list).to have_link('Filter granules')
    end

    context "clicking on the dataset details button" do
      before :all do
        granule_list.click_link('View details')
      end

      after :all do
        dataset_details.click_link('Back to Granules')
      end

      it "displays the dataset details" do
        expect(page).to have_visible_dataset_details
        expect(page).to have_content('lpdaac@eos.nasa.gov')
      end

      it "displays back navigation with the appropriate text" do
        expect(dataset_details).to have_link('Back to Granules')
      end
    end

    context "clicking on the download button" do
      before :all do
        granule_list.click_link('Retrieve data')
      end

      after :all do
        find('div.modal').click_link('close')
      end

      it "triggers the download workflow" do
        expect(page).to have_selector('div.modal')
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

    context "clicking the remove granule button" do
      use_dataset 'C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)'
      hook_granule_results

      before :all do
        first_granule_list_item.click
        first_granule_list_item.click_link "Exclude this granule"
      end

      after :all do
        click_button "granule-filters-clear"
        granule_list.click_link('Hide granule filters')
      end

    end

  end

  context "for datasets with many granule results" do
    use_dataset 'C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)'

    context "clicking on a dataset result" do
      hook_granule_results(:each)

      it "displays the first granule results in a list that pages by 20" do
        expect(page).to have_css('#granule-list .panel-list-item', count: 20)
        page.execute_script "$('#granule-list .master-overlay-content')[0].scrollTop = 10000"
        expect(page).to have_css('#granule-list .panel-list-item', count: 39)
        expect(page).to have_no_content('Loading granules...')
      end
    end
  end

  context "for datasets with few granule results" do
    use_dataset 'C179003380-ORNL_DAAC', 'A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves'

    context "clicking on a dataset result" do
      hook_granule_results

      it "displays all available granule results" do
        expect(page).to have_css('#granule-list .panel-list-item', count: 2)
      end

      it "does not attempt to load additional granule results" do
        expect(page).to have_no_text("Loading granules...")
      end
    end
  end

  context "for datasets without granules" do
    use_dataset 'C179002048-SEDAC', '2008 Natural Resource Management Index (NRMI)'

    context "clicking on a dataset result" do
      before :all do
        expect(page).to have_visible_dataset_results
        first_dataset_result.click
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
