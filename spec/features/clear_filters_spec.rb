# EDSC-37 As a user, I want to clear my dataset filters so that I may start a new search

require 'spec_helper'

describe "Clear Filters" do
  before do
    visit '/'
  end

  it "clears keywords" do
    fill_in "keywords", with: "AST_L1A"
    expect(page).to have_content('ASTER L1A')

    click_link 'Clear All Filters'
    expect(page).to have_no_content('ASTER L1A')
    expect(page.find("#keywords")).to have_no_text("AST_L1A")
  end

  it "clears spatial" do
    create_point(0, 0)
    click_link "Browse All Data"
    expect(page).to have_no_content("15 Minute Stream Flow Data: USGS")
    expect(page).to have_content("2000 Pilot Environmental Sustainability Index")

    click_link 'Clear All Filters'
    expect(page).to have_content("15 Minute Stream Flow Data: USGS")
    expect(page).to have_no_css('#map .leaflet-marker-icon')
  end
end
