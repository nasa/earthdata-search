require "spec_helper"

def should_filter_granules
  # click outside the last input field to trigger knockout to update
  page.find(".master-overlay-secondary-content").click
  expect(page).to have_no_content(@before_granule_count.to_s + ' Granules')

  number_granules = page.text.should match /\d+ Granules/
  after_granule_count = number_granules.to_s.split(" ")[0].to_i

  @before_granule_count.should be > after_granule_count
end

def should_reset_filters
  expect(page).to have_content(@before_granule_count.to_s + ' Granules')
end

describe "Granule search filters", reset: false do
  original_wait_time = nil
  @before_granule_count = 0

  before(:all) do
    original_wait_time = Capybara.default_wait_time
    Capybara.default_wait_time = 30 # Ugh, so slow

    Capybara.reset_sessions!
    visit "/search"
    fill_in "keywords", with: "ASTER L1A"
    expect(page).to have_content('ASTER L1A')

    first_dataset_result.click_link "Add dataset to the current project"

    dataset_results.click_link "View Project"

    expect(page).to have_content('Granules')

    first_project_dataset.click_link "Filter granules"

    number_granules = page.text.should match /\d+ Granules/
    @before_granule_count = number_granules.to_s.split(" ")[0].to_i
  end

  after(:all) do
    reset_overlay
    reset_project
    Capybara.default_wait_time = original_wait_time
  end

  context "when choosing a day/night flag" do
    after :each do
      select 'Anytime', from: "day-night-select"
      should_reset_filters
    end

    it "selecting day returns day granules" do
      select 'Day only', from: "day-night-select"

      should_filter_granules
    end

    it "selecting night returns night granules" do
      select 'Night only', from: "day-night-select"

      should_filter_granules
    end

    it "selecting both returns both day and night granules" do
      select 'Both day and night', from: "day-night-select"

      should_filter_granules
    end
  end

  context "when choosing cloud cover" do
    after :each do
      script = "edsc.page.project.datasets()[0].granuleQuery.cloud_cover_min('');edsc.page.project.datasets()[0].granuleQuery.cloud_cover_max('')"
      page.evaluate_script script
      should_reset_filters
    end

    it "filters with both min and max" do
      fill_in "Minimum:", with: "2.5"
      fill_in "Maximum:", with: "5.0"

      should_filter_granules
    end

    it "filters with only min" do
      fill_in "Minimum:", with: "2.5"

      should_filter_granules
    end

    it "filters with only max" do
      fill_in "Maximum:", with: "5.0"

      should_filter_granules
    end
  end
end
