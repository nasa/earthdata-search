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
      page.all('#map .leaflet-tile', visible: false).each do |img|
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
end
