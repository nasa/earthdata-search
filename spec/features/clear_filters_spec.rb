# EDSC-37 As a user, I want to clear my collection filters so that I may start a new search

require 'spec_helper'

describe "'Clear Filters' button", reset: false do
  before :all do
    load_page :search, facets: true
  end

  it "clears keywords" do
    fill_in "keywords", with: "AST_L1A"
    expect(page).to have_content('ASTER L1A')

    click_link "Clear Filters"
    expect(page).to have_no_content('ASTER L1A')
    expect(page.find("#keywords")).to have_no_text("AST_L1A")
  end

  it "clears spatial" do
    create_point(67, -155)
    expect(page).to have_no_content("15 Minute Stream Flow Data: USGS (FIFE)")
    expect(page).to have_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")

    click_link "Clear Filters"
    expect(page).to have_content("15 Minute Stream Flow Data: USGS (FIFE)")
    expect(page).to have_content("A Global Database of Carbon and Nutrient Concentrations of Green and Senesced Leaves")
  end

  context "clears temporal" do
    after :each do
      # close temporal dropdown
      click_link "Temporal"
      click_link "Clear Filters"
      wait_for_xhr
    end

    it "range" do
      script = "var temporal = edsc.models.page.current.query.temporal.applied;
                temporal.start.date(new Date('1978-12-01T00:00:00Z'));
                temporal.stop.date(new Date('1979-12-01T00:00:00Z'));
                temporal.isRecurring(false);
                null;"
      page.execute_script(script)
      fill_in "keywords", with: 'C179003030-ORNL_DAAC'

      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")

      click_link "Clear Filters"

      fill_in "keywords", with: 'C179003030-ORNL_DAAC'
      expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      click_link "Temporal"
      expect(page.find("#collection-temporal-range-start")).to have_no_text("1978-12-01 00:00:00")
      expect(page.find("#collection-temporal-range-stop")).to have_no_text("1979-12-01 00:00:00")
      page.find('body > footer .version').click # Click away from timeline
    end

    it "recurring" do
      script = "var temporal = edsc.models.page.current.query.temporal.applied;
                temporal.start.date(new Date('1970-12-01T00:00:00Z'));
                temporal.stop.date(new Date('1975-12-01T00:00:00Z'));
                temporal.isRecurring(true);
                null;"
      page.execute_script(script)

      fill_in "keywords", with: 'C179003030-ORNL_DAAC'
      expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")

      click_link "Clear Filters"
      wait_for_xhr
      fill_in "keywords", with: 'C179003030-ORNL_DAAC'
      expect(page).to have_content("15 Minute Stream Flow Data: USGS")
      click_link "Temporal"
      expect(page.find("#collection-temporal-recurring-start")).to have_no_text("1970-12-01 00:00:00")
      expect(page.find("#collection-temporal-recurring-stop")).to have_no_text("1975-12-31 00:00:00")
      expect(page.find(".temporal-recurring-year-range-value")).to have_text("1960 - #{Time.new.year}")
      page.find('body > footer .version').click # Click away from timeline
    end
  end

  it "clears facets" do
    find("h3.facet-title", text: 'Project').click
    find(".facets-item", text: "EOSDIS").click
    within(:css, '#collapse2 .panel-body.facets') do
      expect(page).to have_content("EOSDIS")
      expect(page).to have_css(".facets-item.selected")
    end

    click_link "Clear Filters"

    expect(page).to have_no_css(".facets-item.selected")
  end
end
