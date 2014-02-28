# EDSC-15 As a user, I want to search for datasets by simple temporal date
#         range so that I may limit my results the relevant time span

require "spec_helper"

def close_datetimepicker
  page.find(".xdsoft_time.xdsoft_current").click
end

describe "Temporal" do
  before :each do
    visit "/search"
  end

  after :each do
    reset_search
  end

  context "range selection" do
    it "allows the user to search from a start date time to the present" do
      click_link "Temporal"
      fill_in "Start", with: "2013-12-01 00:00:00"
      close_datetimepicker
      click_button "Apply Filter"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
      expect(page).to have_content("Start 2013-12-01 00:00:00")
    end

    it "allows the user to search up to the end date time" do
      click_link "Temporal"
      fill_in "End", with: "1970-12-01 00:00:00"
      close_datetimepicker
      click_button "Apply Filter"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")
      expect(page).to have_content("Stop 1970-12-01 00:00:00")
    end

    it "allows the user to search from a start date time to an end date time" do
      click_link "Temporal"
      fill_in "Start", with: "1975-12-01 00:00:00"
      close_datetimepicker
      fill_in "End", with: "1975-12-01 00:00:00"
      close_datetimepicker
      click_button "Apply Filter"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_no_content("2000 Pilot Environmental Sustainability Index")
      expect(page).to have_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")
      expect(page).to have_content("Start 1975-12-01 00:00:00")
      expect(page).to have_content("Stop 1975-12-01 00:00:00")
    end

    it "allows the user to clear the date time range" do
      click_link "Temporal"
      fill_in "Start", with: "1978-12-01 00:00:00"
      close_datetimepicker
      fill_in "End", with: "1979-12-01 00:00:00"
      close_datetimepicker
      click_button "Apply Filter"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_no_content("2001 Environmental Sustainability Index (ESI)")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
      expect(page).to have_content("Start 1978-12-01 00:00:00")
      expect(page).to have_content("Stop 1979-12-01 00:00:00")

      click_link "Temporal"
      # I can't just click the Clear button
      fill_in "End", with: "1979-12-01 00:00:00"
      close_datetimepicker
      # until now
      page.find_by_id("temporal-clear").click
      click_button "Apply Filter"

      expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2001 Environmental Sustainability Index (ESI)")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
      expect(page).to have_no_content("Start 1978-12-01 00:00:00")
      expect(page).to have_no_content("Stop 1979-12-01 00:00:00")
    end

    it "validates incorrect user input" do
      click_link "Temporal"
      fill_in "Start", with: "1979-12-10 00:00:00"
      close_datetimepicker
      fill_in "End", with: "1979-12-01 00:00:00"
      close_datetimepicker
      click_button "Apply Filter"

      expect(page).to have_content("Start must be no later than End")
    end

    it "allows the user to search by day-of-year input" do
      click_link "Temporal"
      fill_in "Start", with: "2014-01-01 00:00:00" # clicking doesn't work the first time
      fill_in "Day of Year:", with: "1978-335"
      click_button "Set"
      page.find_by_id("temporal-range-stop").click
      fill_in "Day of Year:", with: "1979-335"
      click_button "Set"
      click_button "Apply Filter"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_no_content("2001 Environmental Sustainability Index (ESI)")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
      expect(page).to have_content("Start 1978-12-01 00:00:00")
      expect(page).to have_content("Stop 1979-12-01 00:00:00")
    end

  end

  context "recurring range selection" do
    it "allows the user to search by recurring date time range" do
      click_link "Temporal"

      # wont let me check recurring yet
      fill_in "Start", with: "12-01 00:00:00"
      close_datetimepicker

      check "Recurring?"
      fill_in "Start", with: "12-01 00:00:00"
      close_datetimepicker
      fill_in "End", with: "12-31 00:00:00"
      close_datetimepicker
      script = "edsc.page.ui.temporal.pending.years([1970, 1975])"
      page.execute_script(script)
      click_button "Apply Filter"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("Amazon River Basin Precipitation, 1972-1992")
      expect(page).to have_content("Start 12-01 00:00:00")
      expect(page).to have_content("Stop 12-31 00:00:00")
      expect(page).to have_content("Range 1970 - 1975")
    end

    it "allows the user to clear the recurring date time search" do
      click_link "Temporal"
      
      # wont let me check recurring yet
      fill_in "Start", with: "12-01 00:00:00"
      close_datetimepicker

      check "Recurring?"
      fill_in "Start", with: "12-01 00:00:00"
      close_datetimepicker
      fill_in "End", with: "12-31 00:00:00"
      close_datetimepicker
      script = "edsc.page.ui.temporal.pending.years([1970, 1975])"
      page.execute_script(script)
      click_button "Apply Filter"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("Amazon River Basin Precipitation, 1972-1992")
      expect(page).to have_content("Start 12-01 00:00:00")
      expect(page).to have_content("Stop 12-31 00:00:00")
      expect(page).to have_content("Range 1970 - 1975")

      click_link "Temporal"
      # wont let me click yet
      fill_in "Start", with: "12-01 00:00:00"
      close_datetimepicker
      page.find_by_id("temporal-clear").click
      click_button "Apply Filter"

      expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_no_content("Amazon River Basin Precipitation, 1972-1992")
      expect(page).to have_no_content("Start 12-01 00:00:00")
      expect(page).to have_no_content("Stop 12-31 00:00:00")
      expect(page).to have_no_content("Range 1970 - 1975")
    end

    it "validates incorrect user input" do
      click_link "Temporal"
      
      # wont let me check recurring yet
      fill_in "Start", with: "12-01 00:00:00"
      close_datetimepicker

      check "Recurring?"
      fill_in "Start", with: "12-10 00:00:00"
      close_datetimepicker
      fill_in "End", with: "12-01 00:00:00"
      close_datetimepicker
      click_button "Apply Filter"

      expect(page).to have_content("Start must be no later than End")
    end

    it "validates both start and end are present" do
      click_link "Temporal"
      
      # wont let me check recurring yet
      fill_in "Start", with: "12-01 00:00:00"
      close_datetimepicker

      check "Recurring?"
      fill_in "Start", with: "12-10 00:00:00"
      close_datetimepicker

      expect(page).to have_content("Start and End dates must both be selected")
    end

  end
end
