# EDSC-26: As a user, I want to search for collections by place name so that I may limit my results to my area of interest

require "spec_helper"

def choose_suggestion(text)
  script = "$('.tt-suggestion p:contains(\"#{text}\")').click()"
  page.execute_script script
end

describe "Place name autocomplete" do
  texas_constraint = 'bounding_box:-106.645646,25.837163999999998:-93.508039,36.500704'
  map_bounds = "31.166015625!-99.615234375!5!1"

  before do
    load_page :search, overlay: false
  end

  it "displays suggestions when the user provides types a few letters" do
    fill_in "keywords", with: "texas"
    expect(page).to have_content('place:"Texas, United States"')
  end

  it "displays suggestions when the user has typed an appropriate preposition into the search box" do
    fill_in "keywords", with: "modis over texas"
    expect(page).to have_content('place:"Texas, United States"')
  end

  it "displays suggestions when the user has typed 'place:' into the search box" do
    fill_in "keywords", with: "place:\"texas"
    expect(page).to have_content('place:"Texas, United States"')
  end

  it "displays suggestions when the user has typed 'place:' and a keyword into the search box" do
    fill_in "keywords", with: "modis place:texas"
    expect(page).to have_content('place:"Texas, United States"')
  end

  it "applies the first placename spatial when tabbing after a 'place:' keyword search" do
    fill_in "keywords", with: "modis place:texas\t"
    expect(page).to have_field('keywords', with: 'modis place:"Texas, United States"')
    expect(page).to have_spatial_constraint(texas_constraint)
  end

  it "does not apply placename spatial when tabbing after a keyword search without 'place:'" do
    fill_in "keywords", with: "Texas\t"
    expect(page).to have_no_field('keywords', with: 'modis place:"Texas, United States"')
    expect(page).to have_no_spatial_constraint(texas_constraint)
  end

  it "displays nothing when the query string is very short" do
    fill_in "keywords", with: "te"
    wait_for_xhr
    expect(page).to have_no_css('.tt-suggestion')
  end

  it "displays nothing when the query string has no placename matches" do
    fill_in "keywords", with: "asdfasdfasdfqwer"
    wait_for_xhr
    expect(page).to have_no_css('.tt-suggestion')
  end

  it "adds a spatial constraint when the user accepts a suggestion" do
    fill_in "keywords", with: "modis over texas"
    wait_for_xhr
    choose_suggestion 'Texas, United States'
    expect(page).to have_field('keywords', with: 'modis place:"Texas, United States"')
    expect(page).to have_spatial_constraint(texas_constraint)
  end

  it "when using place:'...', adds a spatial constraint when the user accepts a suggestion" do
    fill_in "keywords", with: "place:\"texas"
    wait_for_xhr
    choose_suggestion 'Texas, United States'
    expect(page).to have_field('keywords', with: 'place:"Texas, United States"')
    expect(page).to have_spatial_constraint(texas_constraint)
  end

  it "adds no spatial constraint when the user ignores a suggestion" do
    fill_in "keywords", with: "texas"
    expect(page).to have_spatial_constraint('')
  end

  it "adds a spatial constraint when the user uses place: but does not select a suggestion" do
    fill_in "keywords", with: "place:\"Texas, United States\""
    wait_for_xhr
    expect(page).to have_spatial_constraint(texas_constraint)
  end

  context "when the user has accepted a suggestion" do
    before :each do
      fill_in "keywords", with: "modis over texas"
      wait_for_xhr
      choose_suggestion 'Texas, United States'
      expect(page).to have_field('keywords', with: 'modis place:"Texas, United States"')
      wait_for_xhr
    end

    it 'centers the map over the suggested spatial area' do
      script = "$('#map').data('map').map.getCenter().toString()"
      result = page.evaluate_script script

      expect(result).to eq("LatLng(31.16893, -99.61981)")
    end

    it 'zooms the map to the suggested spatial area' do
      script = "$('#map').data('map').map.getZoom()"
      result = page.evaluate_script script

      expect(result).to eq(5)
    end

    it "removes the placename from the search box if the user alters the spatial constraint" do
      create_point(0, 0)
      wait_for_xhr
      expect(page).to have_field('keywords', with: 'modis')
    end

    it "removes the spatial constraint if the user removes the placename from the search box" do
      fill_in "keywords", with: ""
      fill_in "keywords", with: "modis"
      wait_for_xhr
      expect(page).to have_field('keywords', with: 'modis')
      expect(page).to have_spatial_constraint('')
    end
  end

  context "search for common collection terms" do
    it 'returns no placenames matching "landsat"' do
      fill_in "keywords", with: "landsat"
      wait_for_xhr
      expect(page).to have_no_css('.tt-suggestion')
    end

    it 'filters common terms in a case-insensitive way' do
      fill_in "keywords", with: "Landsat"
      wait_for_xhr
      expect(page).to have_no_css('.tt-suggestion')
    end

    it 'returns no placenames matching "modis"' do
      fill_in "keywords", with: "modis"
      wait_for_xhr
      expect(page).to have_no_css('.tt-suggestion')
    end
  end
end
