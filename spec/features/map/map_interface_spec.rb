# EDSC-28 As a user, I want to see a primary interface focused on a map so that
#         I may focus on the spatial aspects of my searches and results

require "spec_helper"

describe "Map interface" do
  before do
    visit "/"
  end

  shared_browser_session do
    it "displays the whole Earth centered in plate carree projection on the main page" do
      expect(page).to have_css('#map.leaflet-container')

      # 'visible: false' because leaflet fails to load the tiles and therefore keeps them hidden
      TileUtil.tiles(page, '#map').each do |img|
        src = img['src']
        expect(src).to match(/TILEMATRIXSET=EPSG4326/) # Plate Carree
        expect(src).to match(/TILEMATRIX=2&/) # Zoomed to show whole Earth

        if src =~ /TILEROW=0&TILECOL=0/
          # For the upper-left tile
          style = img['style']
          expect(style).to match (/-440px, -115px/) # In upper left position
        end
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
  def send_click(selector)
    script = "$('#{selector}').click()"
    page.evaluate_script(script)
  end

  context "projection switching" do
    let (:switcher_selector) { '#map .projection-switcher' }
    let (:north_text) { 'North Polar Stereographic' }
    let (:north_link) { within(switcher_selector) {find_link(north_text)} }
    let (:geo_text) { 'WGS 84 / Plate Carree' }
    let (:geo_link) { within(switcher_selector) {find_link(geo_text)} }
    let (:south_text) { 'South Polar Stereographic' }
    let (:south_link) { within(switcher_selector) {find_link(south_text)} }

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

      expect('#map').to have_tiles_with_projection('EPSG4326')

      send_click "#map a[href=#arctic]"
      expect(north_link).to have_class('leaflet-disabled')
      expect(geo_link).to_not have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('EPSG3413')

      send_click "#map a[href=#geo]"
      expect(north_link).to_not have_class('leaflet-disabled')
      expect(geo_link).to have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('EPSG4326')
    end

    it "allows switching to south polar stereographic projection and back" do
      expect(south_link).to_not have_class('leaflet-disabled')
      expect(geo_link).to have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('EPSG4326')

      send_click "#map a[href=#antarctic]"
      expect(south_link).to have_class('leaflet-disabled')
      expect(geo_link).to_not have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('EPSG3031')

      send_click "#map a[href=#geo]"
      expect(south_link).to_not have_class('leaflet-disabled')
      expect(geo_link).to have_class('leaflet-disabled')

      expect('#map').to have_tiles_with_projection('EPSG4326')
    end

    it "disables the current projection" do
      # Also tested above
      expect(north_link).to_not have_class('leaflet-disabled')
      expect(geo_link).to have_class('leaflet-disabled')
      expect(south_link).to_not have_class('leaflet-disabled')
    end
  end
end
