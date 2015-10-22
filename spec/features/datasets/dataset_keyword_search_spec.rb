require "spec_helper"

describe "Dataset keyword searches", reset: false do
  extend Helpers::DatasetHelpers

  before(:all) do
    Capybara.reset_sessions!
    load_page :search
  end

  # TODO: This should be in an after(:each) block, but it is too slow
  #       because of DOM manipulations when clearing temporal.  Partial
  #       fix is in EDSC-19
  after(:all) do
    reset_search
  end

  it "displays the first 20 dataset results" do
    fill_in "keywords", with: "A"
    expect(page).to have_css('#dataset-results-list .panel-list-item', count: 20)
  end

  it "displays dataset results matching a full keyword" do
    fill_in "keywords", with: "AST_L1A"
    expect(page).to have_content('ASTER L1A')
  end

  it "displays dataset results matching a partial keyword" do
    fill_in "keywords", with: "AST_L"
    expect(page).to have_content('ASTER L1A')
  end

  it "displays all datasets when keywords are cleared" do
    fill_in "keywords", with: " "
    expect(page).to have_content('15 Minute Stream')
  end

  it "do not match wildcard characters" do
    fill_in "keywords", with: "AST_L%"
    expect(page).to have_no_css('#dataset-results .panel-list-item')
  end

  context "returning to the dataset results list" do
    context "after navigating to a project sub-page" do
      use_dataset 'C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)'

      before(:all) do
        first_dataset_result.click_link "Add dataset to the current project"
        dataset_results.click_link "View Project"
        view_granule_results('project-overview')
        granule_list.click_link('Filter granules')
        first_granule_list_item.click_link('View granule details')
        expect(page).to have_content('Day / Night Flag')
      end

      after(:all) do
        Capybara.reset_sessions!
        load_page :search
      end

      it "does not return to the dataset results list when the keyword search is cleared" do
        fill_in "keywords", with: " "
        expect(page).to have_visible_granule_details
      end

      context "setting a new keyword search value" do
        before(:all) do
          fill_in "keywords", with: "AST_L"
          wait_for_xhr
        end

        it "returns to the dataset results list" do
          expect(page).to have_visible_dataset_results
        end

        it "performs a new search" do
          expect(page).to have_content('ASTER L1A')
        end

        it "hides the timeline" do
          expect(page).to have_no_selector('#timeline')
        end

        it "hides the dataset filters" do
          expect(page).to have_no_content('Day / Night Flag')
        end

        context "and clicking on the first dataset result" do
          before(:all) do
            view_granule_results
          end

          it "shows the dataset's granules" do
            expect(page).to have_visible_granule_list
          end
        end
      end
    end

    context "after navigating to a granule results sub-page" do
      use_dataset 'C179003030-ORNL_DAAC', '15 Minute Stream Flow Data: USGS (FIFE)'

      before(:all) do
        view_granule_results
        granule_list.click_link('Filter granules')
        first_granule_list_item.click_link('View granule details')
        expect(page).to have_content('Day / Night Flag')
      end

      after(:all) do
        Capybara.reset_sessions!
        load_page :search
      end

      it "does not return to the dataset results list when the keyword search is cleared" do
        fill_in "keywords", with: " "
        expect(page).to have_visible_granule_details
      end

      context "setting a new keyword search value" do
        before(:all) do
          fill_in "keywords", with: "AST_L"
        end

        it "returns to the dataset results list" do
          expect(page).to have_visible_dataset_results
        end

        it "performs a new search" do
          expect(page).to have_content('ASTER L1A')
        end

        it "hides the timeline" do
          expect(page).to have_no_selector('#timeline')
        end

        it "hides the dataset filters" do
          expect(page).to have_no_content('Day / Night Flag')
        end

        context "and clicking on the first dataset result" do
          before(:all) do
            view_granule_results
          end

          it "shows the dataset's granules" do
            expect(page).to have_visible_granule_list
          end
        end
      end
    end
  end
end
