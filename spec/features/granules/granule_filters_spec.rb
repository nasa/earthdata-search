require "spec_helper"

describe "Granule search filters", reset: false do
  before_granule_count = 0

  before(:all) do
    page.driver.resize_window(2000, 3000) # Avoid having to scroll to click

    # Labs parameter enables additional attribute searching
    load_page :search, project: ['C14758250-LPDAAC_ECS'], view: :project, labs: true

    temporal_start_date = DateTime.new(1999, 12, 1, 0, 0, 0, '+0')
    temporal_stop_date = DateTime.new(2015, 1, 1, 0, 0, 0, '+0')
    set_temporal(temporal_start_date, temporal_stop_date)
    wait_for_xhr

    first_project_collection.click_link "Show granule filters"
    number_granules = project_overview.text.match /\d+ Granules/
    before_granule_count = number_granules.to_s.split(" ")[0].to_i
  end

  after :all do
    page.driver.resize_window(1280, 1024)
  end

  before :each do
    wait_for_xhr
  end

  context "when choosing a day/night flag" do
    after :each do
      first_project_collection.click_link "Show granule filters"
      click_button "granule-filters-clear"
      expect(project_overview).to reset_granules_to(before_granule_count)
    end

    it "selecting day returns day granules" do
      select 'Day only', from: "day-night-select"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    it "selecting night returns night granules" do
      select 'Night only', from: "day-night-select"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    it "selecting both returns both day and night granules" do
      select 'Both day and night', from: "day-night-select"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    it "clicking the clear button selects Anytime" do
      select 'Day only', from: "day-night-select"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)

      first_project_collection.click_link "Show granule filters"
      click_button "granule-filters-clear"
      expect(project_overview).to reset_granules_to(before_granule_count)

      expect(page).to have_select("day-night-select", selected: "Anytime")
      click_button "granule-filters-submit"
    end
  end

  context "when choosing cloud cover" do
    after :each do
      first_project_collection.click_link "Show granule filters"
      click_button "granule-filters-clear"
      expect(project_overview).to reset_granules_to(before_granule_count)
    end

    it "filters with both min and max" do
      fill_in "Minimum:", with: "2.5"
      fill_in "Maximum:", with: "5.0"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    it "filters with only min" do
      fill_in "Minimum:", with: "2.5"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    it "filters with only max" do
      fill_in "Maximum:", with: "5.0"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    it "clicking the clear button clears minimum and maximum" do
      fill_in "Minimum:", with: "2.5"
      fill_in "Maximum:", with: "5.0"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)

      first_project_collection.click_link "Show granule filters"
      click_button "granule-filters-clear"
      expect(project_overview).to reset_granules_to(before_granule_count)

      expect(page).to have_field("Minimum", with: "")
      expect(page).to have_field("Maximum", with: "")
      click_button "granule-filters-submit"
    end

    context "validates input" do
      after :each do
        first_project_collection.click_link "Hide granule filters"
        wait_for_xhr
      end

      it "minimum must be more than 0.0" do
        fill_in "Minimum", with: "-1.0"
        fill_in "Maximum", with: ""
        page.find(".master-overlay-secondary-content").click
        wait_for_xhr
        expect(page).to have_content "Value must be between 0.0 and 100.0"
      end

      it "maximum must be less than 100.0" do
        fill_in "Minimum", with: ""
        fill_in "Maximum", with: "110.0"
        page.find(".master-overlay-secondary-content").click
        wait_for_xhr
        expect(page).to have_content "Value must be between 0.0 and 100.0"
      end

      it "minimum must be less than maximum" do
        fill_in "Minimum", with: "5.0"
        fill_in "Maximum", with: "1.0"
        page.find(".master-overlay-secondary-content").click
        wait_for_xhr
        expect(page).to have_content "Minimum must be less than Maximum"
      end
    end
  end

  context "when choosing data access options" do
    after :each do
      first_project_collection.click_link "Show granule filters"
      click_button "granule-filters-clear"
      expect(project_overview).to reset_granules_to(before_granule_count)
    end

    it "selecting browse only loads granules with browse images" do
      check "Find only granules that have browse images."
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    it "selecting online only loads downloadable granules" do
      check "Find only granules that are available online."
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    it "clicking the clear button unchecks data access options" do
      check "Find only granules that have browse images."
      check "Find only granules that are available online."
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)

      first_project_collection.click_link "Show granule filters"
      click_button "granule-filters-clear"
      expect(project_overview).to reset_granules_to(before_granule_count)

      expect(page).to have_unchecked_field("Find only granules that have browse images.")
      expect(page).to have_unchecked_field("Find only granules that are available online.")
      click_button "granule-filters-submit"
    end
  end

  context "when searching by granule id" do
    after :each do
      first_project_collection.click_link "Show granule filters"
      click_button "granule-filters-clear"
      expect(project_overview).to reset_granules_to(before_granule_count)
    end

    context "with single granule id field" do
      it "selecting Granule ID filters granules" do
        fill_in "granule_id", with: "*2006227720*"
        click_button "granule-filters-submit"
        expect(project_overview).to filter_granules_from(before_granule_count)
      end

      it "clicking the clear button clears granule id field" do
        fill_in "granule_id", with: "*2006227720*"
        click_button "granule-filters-submit"
        expect(project_overview).to filter_granules_from(before_granule_count)

        first_project_collection.click_link "Show granule filters"
        click_button "granule-filters-clear"
        expect(project_overview).to reset_granules_to(before_granule_count)

        expect(page).to have_field("granule_id", with: "")
        click_button "granule-filters-submit"
      end
    end

    context "with granule id textarea" do
      before :each do
        click_link "Search Multiple"
      end

      it "searching with a pattern filters granules" do
        fill_in "granule_id_field", with: "*2006227720*"
        click_button "granule-filters-submit"
        expect(project_overview).to filter_granules_from(before_granule_count)
      end

      it "clicking the clear button clears granule id textarea" do
        fill_in "granule_id_field", with: "*2006227720*"
        click_button "granule-filters-submit"
        expect(project_overview).to filter_granules_from(before_granule_count)

        first_project_collection.click_link "Show granule filters"
        click_button "granule-filters-clear"
        expect(project_overview).to reset_granules_to(before_granule_count)

        expect(page).to have_field("granule_id_field", with: "")
        click_button "granule-filters-submit"
      end
    end
  end

  context "when excluding by granule id" do
    before :all do
      first_project_collection.click
      wait_for_xhr
      number_granules = granule_list.text.match /Showing \d+ of \d+ matching granules/
      before_granule_count = number_granules.to_s.split(" ")[3].to_i

      first_granule_list_item.click
      first_granule_list_item.click_link "Exclude this granule"
    end

    after :all do
      click_button "granule-filters-clear"
      wait_for_xhr
      granule_list.click_link "Back to Collections"
      wait_for_xhr
      first_project_collection.click_link "Show granule filters"
      wait_for_xhr
    end

    it "displays an indication that granules have been excluded" do
      expect(page).to have_content("1 granule has been removed from your results")
    end

    it "removes the granule from the granule list" do
      expect(page).to have_css('#granule-list .panel-list-item', count: 38)
    end

    it "updates the page's hits count" do
      # 38 = (page size - 1) * 2. Because of the browser height
      # removing a granule immediately loads the next page.
      expect(granule_list).to have_content("Showing 38 of #{before_granule_count.to_i - 1} matching granules")
    end

    context "when the user clicks the link to clear removed granules" do
      before :all do
        click_link "Add it back"
        wait_for_xhr
      end

      after :all do
        first_granule_list_item.click
        first_granule_list_item.click_link "Exclude this granule"
        wait_for_xhr
      end

      it "includes the excluded granules in the list" do
        expect(page).to have_css('#granule-list .panel-list-item', count: 20)
      end

      it "updates the granule hits count" do
        expect(page).to have_content("Showing 20 of #{before_granule_count} matching granules")
      end
    end
  end

  context "when searching by temporal" do
    after :each do
      first_project_collection.click_link "Show granule filters"
      click_button "granule-filters-clear"
      js_uncheck_recurring 'granule'
      expect(project_overview).to reset_granules_to(before_granule_count)
    end

    it "selecting temporal range filters granules" do
      fill_in "Start", with: "2013-12-01 00:00:00\t"
      fill_in "End", with: "2013-12-31 00:00:00\t"
      js_click_apply ".master-overlay-content"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    it "selecting temporal recurring filters granules" do
      js_check_recurring 'granule'
      fill_in "Start", with: "12-01 00:00:00\t"
      fill_in "End", with: "12-31 00:00:00\t"
      script = "edsc.page.project.searchGranulesCollection().granuleDatasource().cmrQuery().temporal.pending.years([2005, 2010])"
      page.execute_script(script)
      js_click_apply ".master-overlay-content"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    it "clicking the clear button clears temporal fields" do
      fill_in "Start", with: "2013-12-01 00:00:00\t"
      fill_in "End", with: "2013-12-31 00:00:00\t"
      js_click_apply ".master-overlay-content"
      click_button "granule-filters-submit"
      expect(project_overview).to filter_granules_from(before_granule_count)

      first_project_collection.click_link "Show granule filters"
      click_button "granule-filters-clear"
      expect(project_overview).to reset_granules_to(before_granule_count)

      expect(page).to have_field("Start", with: "")
      expect(page).to have_field("End", with: "")
      click_button "granule-filters-submit"
    end
  end

  it "shows collection additional attributes" do
    expect(page).to have_text('Collection-Specific Attributes')
    expect(page).to have_field('ASTERMapProjection')
  end

  context "when searching by additional attributes" do
    before(:all) do
      fill_in('LowerLeftQuadCloudCoverage', with: '50 - 100')
      wait_for_xhr
      fill_in('DAR_ID', with: '')
      wait_for_xhr
    end

    it "filters granules using the additional attribute values" do
      expect(project_overview).to filter_granules_from(before_granule_count)
    end

    context "when clearing the attribute search" do
      before(:all) do
        click_button "granule-filters-clear"
        wait_for_xhr
      end

      it "clears the attribute search field" do
        expect(page).to have_field('LowerRightQuadCloudCoverage', with: '')
      end

      it "resets the granule search" do
        expect(project_overview).to reset_granules_to(before_granule_count)
      end
    end
  end

  context "when sorting granules" do
    before :all do
      first_project_collection.click
    end

    after :all do
      select 'Start Date, Newest first', from: "granule-sort"
      wait_for_xhr
      granule_list.click_link "Back to Collections"
      first_project_collection.click_link "Show granule filters"
    end

    it "allows sorting by start date ascending" do
      select 'Start Date, Oldest first', from: "granule-sort"
      wait_for_xhr
      expect(granule_list).to have_content "2000-03-04"
      expect(granule_list).to have_no_content "2014-06-12"
    end

    it "allows sorting by start date descending" do
      select 'Start Date, Newest first', from: "granule-sort"
      wait_for_xhr
      expect(granule_list).to have_no_content "2000-03-04"
      expect(granule_list).to have_content "2014-12-31"
    end

    it "allows sorting by end date ascending"do
      select 'End Date, Oldest first', from: "granule-sort"
      wait_for_xhr
      expect(granule_list).to have_content "2000-03-04"
      expect(granule_list).to have_no_content "2014-06-22"
    end

    it "allows sorting by end date descending"do
      select 'End Date, Newest first', from: "granule-sort"
      wait_for_xhr
      expect(granule_list).to have_no_content "2000-03-04"
      expect(granule_list).to have_content "2014-12-31"
    end

  end
end
