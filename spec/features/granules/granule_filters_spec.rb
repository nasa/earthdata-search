require "spec_helper"

describe "Granule search filters", reset: false do
  before(:all) do
    Capybara.reset_sessions!
    visit "/search"
  end

  before(:each) do
    fill_in "keywords", with: "ASTER L1A"
    expect(page).to have_content('ASTER L1A')
    
    first_dataset_result.click_link "Add dataset to the current project"

    dataset_results.click_link "View Project"

    first_project_dataset.click_link "Filter granules"
  end

  after(:each) do
    reset_overlay
    reset_project
  end

  # TODO these granule numbers aren't working very well
  context "when choosing a day/night flag" do
    it "selecting day returns day granules" do
      select 'Day only', from: "day-night-select"

      first_project_dataset.should have_content("1943924 Granules")
    end

    it "selecting night returns night granules" do
      select 'Night only', from: "day-night-select"

      first_project_dataset.should have_content("434414 Granules")
    end

    it "selecting both returns both day and night granules" do
      select 'Both day and night', from: "day-night-select"

      first_project_dataset.should have_content("1758 Granules")
    end
  end
end
