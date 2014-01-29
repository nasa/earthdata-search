require "spec_helper"

describe "Granule search overlay", reset: false do
  before(:all) do
    Capybara.reset_sessions!
    visit "/search"
  end

  before(:each) do
    first_dataset_result.click_link "Add dataset to the current project"
    second_dataset_result.click_link "Add dataset to the current project"

    dataset_results.click_link "View Project"
  end

  after(:each) do
    reset_overlay
    reset_project
  end

  context "when clicking the 'Filter Granules' button" do
    before(:each) do
      first_project_dataset.click_link "Filter granules"
    end

    it "should open granule search overlay" do
      expect(page).to have_visible_granule_search
      expect(page).to have_css("#project-datasets-list .panel-list-item.search-granules", count: 1)
    end

    it "should close granule search overlay when clicking again" do
      first_project_dataset.click_link "Filter granules"

      expect(page).to_not have_visible_granule_search
      expect(page).to have_no_css("#project-datasets-list .panel-list-item.search-granules")
    end

    it "should hide the granule search overlay when returning to dataset list" do
      project_overview.click_link "Back to Dataset Search"

      expect(page).to_not have_visible_granule_search
    end

    it "should hide the granule search overlay when returning to the project" do
      project_overview.click_link "Back to Dataset Search"
      dataset_results.click_link "View Project"

      expect(page).to_not have_visible_granule_search
      expect(page).to have_no_css("#project-datasets-list .panel-list-item.search-granules")
    end

  end
end