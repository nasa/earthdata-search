# EDSC-56: As a user, I want to see a list of top granules matching my search so
#          that I may preview my results before retrieving data

require "spec_helper"

describe "Granule list", :reset => false do
  extend Helpers::DatasetHelpers

  before :all do
    Capybara.reset_sessions!
    visit "/search"
    # scrolling in these specs doesn't work unless the window is resized
    page.driver.resize_window(1000, 1000)
  end

  after :each do
    page.evaluate_script "$('#dataset-results .master-overlay-content')[0].scrollTop = 0"
  end

  context "for datasets with many granule results" do
    use_dataset 'C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)'

    context "clicking on a dataset result" do
      hook_granule_results

      it "displays the first 20 granule results" do
        expect(page).to have_css('#granule-list .panel-list-item', count: 20)
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
      hook_granule_results

      it "shows no granules" do
        expect(page).to have_no_css('#granule-list .panel-list-item')
      end

      it "does not attempt to load additional granule results" do
        expect(page).to have_no_text("Loading granules...")
      end
    end
  end
end
