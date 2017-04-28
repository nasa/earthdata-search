# EDSC-15 As a user, I want to search for collections by simple temporal date
#         range so that I may limit my results the relevant time span

require "spec_helper"

describe "Temporal" do
  before :each do
    load_page :search
  end

  after :each do
    reset_search
  end

  context "range selection" do
    it "allows the user to search from a start date time to the present" do
      click_link "Temporal"
      fill_in "Start", with: "2013-12-01 00:00:00\t"
      js_click_apply ".temporal-dropdown"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")
      expect(page).to have_content("ABoVE: Burn Severity, Fire Progression, Landcover and Field Data, NWT, Canada, 2014")
    end

    it "allows the user to search up to the end date time" do
      click_link "Temporal"
      fill_in "End", with: "1970-12-01 00:00:00\t"
      js_click_apply ".temporal-dropdown"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")

      expect(page).to have_content("Stop: 1970-12-01 00:00:00")
    end

    it "allows the user to search from a start date time to an end date time" do
      click_link "Temporal"
      fill_in "Start", with: "1975-12-01 00:00:00\t"
      fill_in "End", with: "1975-12-01 00:00:00\t"
      js_click_apply ".temporal-dropdown"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")

      expect(page).to have_content("Start: 1975-12-01 00:00:00")
      expect(page).to have_content("Stop: 1975-12-01 00:00:00")
    end

    it "allows the user to clear the date time range" do
      click_link "Temporal"
      fill_in "Start", with: "1978-12-01 00:00:00\t"
      fill_in "End", with: "1979-12-01 00:00:00\t"
      js_click_apply ".temporal-dropdown"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")

      js_click_temporal
      js_click_clear

      expect(page).to have_content("15 Minute Stream Flow Data: USGS (FIFE)")

      expect(page).to have_no_content("Start: 1978-12-01 00:00:00")
      expect(page).to have_no_content("Stop: 1979-12-01 00:00:00")
    end

    it "validates incorrect user input" do
      click_link "Temporal"
      fill_in "Start", with: "1979-12-10 00:00:00\t"
      fill_in "End", with: "1979-12-01 00:00:00\t"
      js_click_apply ".temporal-dropdown"

      expect(page).to have_content("Start must be no later than End")
    end
  end

  context "recurring range selection" do
    it "allows the user to search by recurring date time range" do
      click_link "Temporal"
      js_check_recurring "collection"
      fill_in "Start", with: "12-01 00:00:00\t"
      fill_in "End", with: "12-31 00:00:00\t"
      script = "edsc.page.query.temporal.pending.years([1970, 1975])"
      page.execute_script(script)
      js_click_apply ".temporal-dropdown"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")

      expect(page).to have_content("Start: 12-01 00:00:00")
      expect(page).to have_content("Stop: 12-31 00:00:00")
      expect(page).to have_content("Range: 1970 - 1975")
    end

    it "allows the user to clear the recurring date time search" do
      click_link "Temporal"
      js_check_recurring "collection"
      fill_in "Start", with: "12-01 00:00:00\t"
      fill_in "End", with: "12-31 00:00:00\t"
      script = "edsc.page.query.temporal.pending.years([1970, 1975])"
      page.execute_script(script)
      js_click_apply ".temporal-dropdown"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")

      expect(page).to have_content("Start: 12-01 00:00:00")
      expect(page).to have_content("Stop: 12-31 00:00:00")
      expect(page).to have_content("Range: 1970 - 1975")

      js_click_temporal
      js_click_clear

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")

      expect(page).to have_no_content("Start: 12-01 00:00:00")
      expect(page).to have_no_content("Stop: 12-31 00:00:00")
      expect(page).to have_no_content("Range: 1970 - 1975")
    end

    it "validates incorrect user input" do
      click_link "Temporal"
      js_check_recurring "collection"
      fill_in "Start", with: "12-10 00:00:00\t"
      fill_in "End", with: "12-01 00:00:00\t"

      expect(page).to have_content("Start must be no later than End")
    end

    it "validates both start and end are present" do
      click_link "Temporal"
      js_check_recurring "collection"
      fill_in "Start", with: "12-10 00:00:00\t"

      expect(page).to have_content("Start and End dates must both be selected")
    end

  end
end
