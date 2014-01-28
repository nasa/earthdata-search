require "spec_helper"

describe "Granule search overlay", reset: false do
  before(:all) do
    Capybara.reset_sessions!
    visit "/search"
  end

  after(:each) do
    reset_overlay
  end

  context "when clicking the 'Filter Granules' button" do
    before(:each) do
      first_dataset_result.click_link "Filter granules"
    end

    it "should close master overlay parent" do
      expect(page).to_not have_visible_master_overlay_parent
    end

    it "should open granule search overlay" do
      expect(page).to have_visible_granule_search
    end

    it "should close granule search overlay when clicking again" do
      first_dataset_result.click_link "Filter granules"

      expect(page).to_not have_visible_granule_search
    end
  end
end