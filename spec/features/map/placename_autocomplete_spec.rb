# EDSC-26: As a user, I want to search for datasets by place name so that I may limit my results to my area of interest

require "spec_helper"

describe "Place name autocomplete" do
  before do
    visit "/search"
  end

  it "displays suggestions when the user provides types a few letters" do
    fill_in "keywords", with: "tex"
    expect(page).to have_content('Texas, United States')
  end

  it "displays suggestions when the user has typed an appropriate preposition into the search box" do
    fill_in "keywords", with: "modis over tex"
    expect(page).to have_content('Texas, United States')
  end

  it "displays nothing when the query string is very short" do
    fill_in "keywords", with: "te"
    expect(page).to have_no_css('.tt-suggestion')
  end

  it "displays nothing when the query string has no placename matches" do
    fill_in "keywords", with: "asdfasdfasdfqwer"
    expect(page).to have_no_css('.tt-suggestion')
  end

  it "adds a spatial constraint when the user accepts a suggestion" do
    fill_in "keywords", with: "modis over tex"
    find('.tt-suggestion p', text: 'Texas, United States').click
    expect(page).to have_field('keywords', with: 'modis over Texas, United States')
    expect(page).to have_css('#map .leaflet-marker-icon')
  end

  it "adds no spatial constraint when the user ignores a suggestion" do
    fill_in "keywords", with: "tex"
    expect(page).to have_no_css('#map .leaflet-marker-icon')
  end

  context "when the user has accepted a suggestion" do
    before :each do
      fill_in "keywords", with: "modis over tex"
      wait_for_xhr
      find('.tt-suggestion p', text: 'Texas, United States').click
      expect(page).to have_field('keywords', with: 'modis over Texas, United States')
      wait_for_xhr
    end

    it "removes the placename from the search box if the user alters the spatial constraint" do
      create_point(0, 0)
      wait_for_xhr
      expect(page).to have_field('keywords', with: 'modis')
    end
  end
end
