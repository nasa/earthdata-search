# EDSC-15 As a user, I want to search for datasets by simple temporal date 
#         range so that I may limit my results the relevant time span

require "spec_helper"

describe "Temporal" do
  before do
    visit "/"
  end

  context "range selection" do
    it "allows the user to search from a start date time to the present" do
      click_link "Temporal"
      fill_in "Start", with: "2013-12-01 00:00:00"
      click_button "Apply"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
    end

    it "allows the user to search up to the end date time" do
      click_link "Temporal"
      fill_in "End", with: "1970-12-01 00:00:00"
      click_button "Apply"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")
    end

    it "allows the user to search from a start date time to and end date time" do
      click_link "Temporal"
      fill_in "Start", with: "1975-12-01 00:00:00"
      fill_in "End", with: "1975-12-01 00:00:00"
      click_button "Apply"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_no_content("2000 Pilot Environmental Sustainability Index")
      expect(page).to have_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")
    end

    it "allows the user to clear the end date time" do
      click_link "Temporal"
      fill_in "Start", with: "1978-12-01 00:00:00"
      fill_in "End", with: "1979-12-01 00:00:00"
      click_button "Apply"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_no_content("2001 Environmental Sustainability Index (ESI)")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")

      click_link "Temporal"
      find_by_id("clear_temporal_stop").click

      expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2001 Environmental Sustainability Index (ESI)")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
    end

    it "allows the user to clear the date time range" do
      click_link "Temporal"
      fill_in "Start", with: "1978-12-01 00:00:00"
      fill_in "End", with: "1979-12-01 00:00:00"
      click_button "Apply"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_no_content("2001 Environmental Sustainability Index (ESI)")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")

      click_link "Temporal"
      page.find_by_id("clear_temporal_start").click
      page.find_by_id("clear_temporal_stop").click

      expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("2001 Environmental Sustainability Index (ESI)")
      expect(page).to have_content("2000 Pilot Environmental Sustainability Index")
    end

  end

  context "recurring range selection" do
    it "allows the user to search by recurring date time range" do
      click_link "Temporal"
      click_link "Recurring"
      fill_in "Start", with: "12-01 00:00:00"
      fill_in "End", with: "12-31 00:00:00"
      script = "$('span.temporal-recurring-year-range-value').html('1970 - 1975')"
      page.execute_script(script)
      click_button "Apply"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")
    end

    it "allows the user to clear the recurring date time search" do
      click_link "Temporal"
      click_link "Recurring"
      fill_in "Start", with: "12-01 00:00:00"
      fill_in "End", with: "12-31 00:00:00"
      script = "$('span.temporal-recurring-year-range-value').html('1970 - 1975')"
      page.execute_script(script)
      click_button "Apply"

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")

      click_link "Temporal"
      click_link "Recurring"
      page.find_by_id("temporal-recurring-clear").click

      expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      expect(page).to have_no_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")
    end

  end
end
