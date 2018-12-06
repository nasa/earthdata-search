# EDSC-28 As a user, I want to see a primary interface focused on a map so that
#         I may focus on the spatial aspects of my searches and results
# EDSC-29 As a user, I want to select alternate layers for the map so that I may
#         have better context for my search
# EDSC-30 As a user, I want to select alternate map projections so that I may
#         view areas of interest commonly distorted by default projections

require "spec_helper"

describe "Map interface" do
  before do
    load_page :search, overlay: false
  end

  let(:switcher_selector) { '#map .projection-switcher' }
  let(:north_text) { 'North Polar Stereographic' }
  let(:north_link) { within(switcher_selector) {find_link(north_text)} }
  let(:geo_text) { 'Geographic (Equirectangular)' }
  let(:geo_link) { within(switcher_selector) {find_link(geo_text)} }
  let(:south_text) { 'South Polar Stereographic' }
  let(:south_link) { within(switcher_selector) {find_link(south_text)} }

  shared_browser_session do
    it "displays the whole Earth centered in plate carree projection on the main page" do
      expect(page).to have_css('#map.leaflet-container')

      MapUtil.tiles(page, '#map').each do |img|
        src = img['src']
        expect(src).to match(/TILEMATRIXSET=epsg4326/) # Plate Carree
        expect(src).to match(/TILEMATRIX=2&/) # Zoomed to show whole Earth
      end
    end

    it "displays enabled zoom controls" do
      expect(page).to have_css('.leaflet-control-zoom-in:not(.leaflet-disabled)')
      expect(page).to have_css('.leaflet-control-zoom-out:not(.leaflet-disabled)')
    end
  end

  # This is a hack.  See https://github.com/thoughtbot/capybara-webkit/issues/494
  # Places where this is used have been tested as working in Selenium but are
  # broken in capybara-webkit.  This sends a fake click using Javascript
  context "projection switching" do
    it "displays controls to switch between north pole, south pole, and global projections" do
      expect(page).to have_css(switcher_selector)

      within switcher_selector do
        expect(page).to have_link(north_text)
        expect(page).to have_link(geo_text)
        expect(page).to have_link(south_text)
      end
    end

    it "allows switching to north polar stereographic projection and back" do
      expect(north_link).to_not have_class('leaflet-disabled')
      expect(geo_link).to have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('epsg4326')

      click_link north_text
      expect(north_link).to have_class('leaflet-disabled')
      expect(geo_link).to_not have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('epsg3413')

      click_link geo_text
      expect(north_link).to_not have_class('leaflet-disabled')
      expect(geo_link).to have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('epsg4326')
    end

    it "allows switching to south polar stereographic projection and back" do
      expect(south_link).to_not have_class('leaflet-disabled')
      expect(geo_link).to have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('epsg4326')

      click_link south_text
      expect(south_link).to have_class('leaflet-disabled')
      expect(geo_link).to_not have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('epsg3031')

      click_link geo_text
      expect(south_link).to_not have_class('leaflet-disabled')
      expect(geo_link).to have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('epsg4326')
    end

    it "disables the current projection" do
      # Also tested above
      expect(north_link).to_not have_class('leaflet-disabled')
      expect(geo_link).to have_class('leaflet-disabled')
      expect(south_link).to_not have_class('leaflet-disabled')
    end
  end

  context "layer switcher" do
    it "presents base and overlay layers on mouse hover" do
      expect(page).to_not have_field("Corrected Reflectance (True Color)")

      page.find_link('Layers').hover
      expect(page).to have_field("Blue Marble")
      expect(page).to have_field("Corrected Reflectance (True Color)")
      expect(page).to have_field("Land / Water Map")
      expect(page).to have_field("Borders and Roads")
      expect(page).to have_field("Coastlines")
      expect(page).to have_field("Place Labels")
    end

    it "allows switching base layers" do
      page.find_link('Layers').hover

      within '#map' do
        choose 'Land / Water Map'
      end

      expect('#map').to have_tiles_for_product('OSM_Land_Water_Map')
      expect('#map').to_not have_tiles_for_product('BlueMarble_ShadedRelief_Bathymetry')
    end

    it "draws overlay layers on top of the base layer" do
      page.find_link('Layers').hover

      within '#map' do
        check 'Coastlines'
      end

      expect('#map').to have_tiles_for_product('BlueMarble_ShadedRelief_Bathymetry')
      expect('#map').to have_tiles_for_product('Coastlines')
    end
  end
end
