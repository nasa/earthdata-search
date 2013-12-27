# EDSC-37 As a user, I want to clear my dataset filters so that I may start a new search

require 'spec_helper'

describe "Clear Filters" do
  before do
    visit '/'
  end

  it "clears keywords" do
    fill_in "keywords", with: "AST_L1A"
    expect(page).to have_content('ASTER L1A')

    click_link "Clear Filters"
    expect(page).to have_no_content('ASTER L1A')
    expect(page.find("#keywords")).to have_no_text("AST_L1A")
  end

  it "clears spatial" do
    create_point(0, 0)
    click_link "Browse All Data"
    expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
    expect(page).to have_content("2000 Pilot Environmental Sustainability Index")

    click_link "Clear Filters"
    expect(page).to have_content("15 Minute Stream Flow Data: USGS")
    expect(page).to have_no_css('#map .leaflet-marker-icon')
  end

  context "clears temporal" do
    it "range" do
      script = "edsc.models.searchModel.query.temporal_start('1978-12-01T00:00:00Z')"
      page.evaluate_script(script)
      script = "edsc.models.searchModel.query.temporal_stop('1979-12-01T00:00:00Z')"
      page.evaluate_script(script)

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")

      click_link "Clear Filters"

      expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      click_link "Temporal"
      expect(page.find("#temporal_start")).to have_no_text("1978-12-01 00:00:00")
      expect(page.find("#temporal_stop")).to have_no_text("1979-12-01 00:00:00")
    end

    it "recurring" do
      script = "edsc.models.searchModel.query.temporal_recurring(['1970-12-01T00:00:00Z','1975-12-31T00:00:00Z',335,365])"
      page.evaluate_script(script)

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")

      click_link "Clear Filters"

      expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      click_link "Temporal"
      click_link "Recurring"
      expect(page.find("#temporal_start")).to have_no_text("1970-12-01 00:00:00")
      expect(page.find("#temporal_stop")).to have_no_text("1975-12-31 00:00:00")
      expect(page.find("#temporal-recurring-year-range-value")).to have_text("1960 - 2013")
    end
  end
end
