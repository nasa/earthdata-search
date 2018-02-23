require "spec_helper"

describe "Granule search overlay", reset: false do
  before(:all) do
    Capybara.reset_sessions!
    load_page :search, ac: true, ff: 'Near Real Time'
  end

  before(:each) do
    add_collection_to_project('C1219032680-LANCEMODIS', 'MODIS/Aqua Near Real Time (NRT) Calibrated Radiances 5-Min L1B Swath 1km')
    add_collection_to_project('C1408830900-LANCEAMSR2', 'NRT AMSR2 UNIFIED L2B HALF-ORBIT 25 KM EASE-GRID SURFACE SOIL MOISTURE V1')

    find("#view-project").click
  end

  after(:each) do
    reset_overlay
    reset_project
  end

  context "when clicking the 'Filter Granules' button" do
    before(:each) do
      first_project_collection.click_link "Show granule filters"
    end

    it "should open granule search overlay" do
      expect(page).to have_visible_granule_search
      expect(page).to have_link("Hide granule filters", count: 1)
    end

    #it "should close granule search overlay when clicking again" do
    #  first_project_collection.click_link "Hide granule filters"
    #
    #  expect(page).to_not have_visible_granule_search
    #  expect(page).to have_no_link("Hide granule filters")
    #end

    # JS: In the new design you can't click the show granule search button again to close
    # so you need to click the close icon. Adding test for this new case.

    it "should close granule search overlay when clicking close icon" do
      within("#granule-search") do
        page.click_link('close')
      end

      expect(page).to_not have_visible_granule_search
      expect(page).to have_no_link("Hide granule filters")
    end

    it "should hide the granule search overlay when returning to collection list" do
      project_overview.click_link "Back to Collection Search"

      expect(page).to_not have_visible_granule_search
    end

    it "should hide the granule search overlay when returning to the project" do
      project_overview.click_link "Back to Collection Search"
      find("#view-project").click

      expect(page).to_not have_visible_granule_search
      expect(page).to have_no_link("Hide granule filters")
    end

  end
end
