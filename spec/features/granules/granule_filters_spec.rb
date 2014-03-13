require "spec_helper"

describe "Granule search filters", reset: false do
  original_wait_time = nil
  before_granule_count = 0

  before(:all) do
    original_wait_time = Capybara.default_wait_time
    Capybara.default_wait_time = 60 # Ugh, so slow

    Capybara.reset_sessions!
    visit "/search"
    fill_in "keywords", with: "ASTER L1A"
    expect(page).to have_content('ASTER L1A')

    first_dataset_result.click_link "Add dataset to the current project"

    dataset_results.click_link "View Project"

    expect(page).to have_content('Granules')

    first_project_dataset.click_link "Filter granules"

    number_granules = expect(page.text).to match /\d+ Granules/
    before_granule_count = number_granules.to_s.split(" ")[0].to_i
  end

  after(:all) do
    reset_overlay
    reset_project
    Capybara.default_wait_time = original_wait_time
  end

  context "when choosing a day/night flag" do
    after :each do
      first_project_dataset.click_link "Filter granules"
      click_button "granule-filters-clear"
      expect(page).to reset_granules_to(before_granule_count)
    end

    it "selecting day returns day granules" do
      select 'Day only', from: "day-night-select"
      expect(page).to filter_granules_from(before_granule_count)
    end

    it "selecting night returns night granules" do
      select 'Night only', from: "day-night-select"
      expect(page).to filter_granules_from(before_granule_count)
    end

    it "selecting both returns both day and night granules" do
      select 'Both day and night', from: "day-night-select"
      expect(page).to filter_granules_from(before_granule_count)
    end
  end

  context "when choosing cloud cover" do
    after :each do
      first_project_dataset.click_link "Filter granules"
      click_button "granule-filters-clear"
      expect(page).to reset_granules_to(before_granule_count)
    end

    it "filters with both min and max" do
      fill_in "Minimum:", with: "2.5"
      fill_in "Maximum:", with: "5.0"
      expect(page).to filter_granules_from(before_granule_count)
    end

    it "filters with only min" do
      fill_in "Minimum:", with: "2.5"
      expect(page).to filter_granules_from(before_granule_count)
    end

    it "filters with only max" do
      fill_in "Maximum:", with: "5.0"
      expect(page).to filter_granules_from(before_granule_count)
    end

    context "validates input" do
      after :each do
        first_project_dataset.click_link "Filter granules"
      end

      it "minimum must be more than 0.0" do
        fill_in "Minimum", with: "-1.0"
        fill_in "Maximum", with: ""
        page.find(".master-overlay-secondary-content").click
        expect(page).to have_content "Value must be between 0.0 and 100.0"
      end

      it "maximum must be less than 100.0" do
        fill_in "Minimum", with: ""
        fill_in "Maximum", with: "110.0"
        page.find(".master-overlay-secondary-content").click
        expect(page).to have_content "Value must be between 0.0 and 100.0"
      end

      it "minimum must be less than maximum" do
        fill_in "Minimum", with: "5.0"
        fill_in "Maximum", with: "1.0"
        page.find(".master-overlay-secondary-content").click
        expect(page).to have_content "Minimum must be less than Maximum"
      end
    end
  end

  context "when choosing data access options" do
    after :each do
      first_project_dataset.click_link "Filter granules"
      click_button "granule-filters-clear"
      expect(page).to reset_granules_to(before_granule_count)
    end

    it "selecting browse only loads granules with browse images" do
      check "Find only granules that have browse images."
      expect(page).to filter_granules_from(before_granule_count)
    end

    it "selecting online only loads downloadable granules" do
      check "Find only granules that are available online."
      expect(page).to filter_granules_from(before_granule_count)
    end
  end

  context "when searching by granule id" do
    after :each do
      first_project_dataset.click_link "Filter granules"
      click_button "granule-filters-clear"
      expect(page).to reset_granules_to(before_granule_count)
    end

    context "with single granule id field" do
      it "selecting Granule ID filters granules" do
        fill_in "granule_id", with: "%2006227720%"
        expect(page).to filter_granules_from(before_granule_count)
      end
    end

    context "with granule id textarea" do
      before :each do
        click_link "Search Multiple"
      end

      it "selecting Granule UR filters granules" do
        choose "Search by Granule UR"
        fill_in "granule_id_field", with: "%2006227720%"
        expect(page).to filter_granules_from(before_granule_count)
      end

      it "selecting Local Granule ID filters granules" do
        choose "Search by Local Granule ID"
        fill_in "granule_id_field", with: "%03232002054831%"
        expect(page).to filter_granules_from(before_granule_count)
      end
    end
  end

  context "when searching by temporal" do
    after :each do
      first_project_dataset.click_link "Filter granules"
      click_button "granule-filters-clear"
      expect(page).to reset_granules_to(before_granule_count)
    end

    context "temporal range" do
      it "selecting temporal range filters granules" do
        fill_in "Start", with: "2013-12-01 00:00:00"
        close_datetimepicker
        fill_in "End", with: "2013-12-31 00:00:00"
        close_datetimepicker
        js_click_apply ".master-overlay-content"
        expect(page).to filter_granules_from(before_granule_count)
      end
    end

    context "temporal recurring" do
      it "selecting temporal recurring filters granules" do
        js_check_recurring 'granule'
        fill_in "Start", with: "12-01 00:00:00"
        close_datetimepicker
        fill_in "End", with: "12-31 00:00:00"
        close_datetimepicker
        script = "edsc.page.project.searchGranulesDataset().granulesModel.temporal.pending.years([2005, 2010])"
        page.execute_script(script)
        js_click_apply ".master-overlay-content"
        expect(page).to filter_granules_from(before_granule_count)
      end
    end
  end

end
