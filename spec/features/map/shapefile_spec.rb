# EDSC-25: As a user, I want to search for datasets by ESRI shapefile so that I
#          may limit my results to my area of interest

require "spec_helper"

describe "Shapefile search", reset: false, wait: 30 do
  before :all do
    visit "/search"
  end

  context "when uploading a shapefile containing multiple features" do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/complex.geojson')
    end

    after :all do
      clear_shapefile
    end

    it "displays the shapefile's features" do
      expect(page).to have_css('.geojson-svg')
      expect(page).to have_css('.geojson-icon')
    end

    it "displays a help message prompting the user to select a feature" do
      expect(page).to have_popover('Choose a Search Constraint')
    end

    context "when clicking on a feature" do
      before :all do
        page.execute_script("$('.geojson-svg').first().mapClick()")
      end

      after :all do
        clear_spatial
      end

      it "sets the feature as the current search constraint" do
        expect(page).to have_spatial_constraint('polygon:102,0:103,1:104,0:105,1')
      end

      it "hides the help message prompting the user to select a feature" do
        expect(page).to have_no_popover('Choose a Search Constraint')
      end
    end
  end

  context "when uploading a shapefile containing a single feature" do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/simple.geojson')
    end

    after :all do
      clear_shapefile
      clear_spatial
    end

    it "sets the feature as the current search constraint" do
      expect(page).to have_css('.leaflet-overlay-pane path')
      expect(page).to have_spatial_constraint('polygon:100,0:101,0:101,1:100,1')
    end

    it "displays no help message prompting the user to select a feature" do
      expect(page).to have_css('.leaflet-overlay-pane path')
      expect(page).to have_no_popover('Choose a Search Constraint')
    end
  end

  context "when selecting a shapefile feature containing a large number of points" do
    before :all do
      expect(page).to have_no_css('.geojson-svg')
      upload_shapefile('doc/example-data/shapefiles/large.geojson')
      expect(page).to have_css('.geojson-svg')
    end

    after :all do
      clear_shapefile
      clear_spatial
    end

    it "sets a search constraint containing a reduced number of points" do
      expect(MapUtil.spatial(page).split(':').size).to be <= 51
    end

    it "displays a help message explaining the point reduction" do
      expect(page).to have_popover('Shape File Too Large')
    end
  end

  context "when removing an uploaded shapefile" do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/simple.geojson')
      click_link "Remove file"
    end

    after :all do
      clear_spatial
    end

    it "hides the shapefile's display" do
      expect(page).to have_no_css('.geojson-svg')
      expect(page).to have_no_css('.geojson-icon')
    end

    it "keeps search constraints" do
      expect(page).to have_spatial_constraint('polygon:100,0:101,0:101,1:100,1')
    end
  end

  context "when switching spatial search tools" do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/simple.geojson')
      expect(page).to have_css('.geojson-svg')
      choose_tool_from_map_toolbar('Point')
    end

    after :all do
      within '#map' do
        click_link "Cancel"
      end
      clear_shapefile
      clear_spatial
    end

    it "hides the shapefile's display" do
      expect(page).to have_no_css('.geojson-svg')
    end

    it "hides shapefile search constraints" do
      expect(page).to have_no_css('.leaflet-overlay-pane path')
    end

    context "upon canceling the spatial selection" do
      before :all do
        within '#map' do
          click_link "Cancel"
        end
      end

      after :all do
        choose_tool_from_map_toolbar('Point')
      end

      it "restores the shapefile's display" do
        expect(page).to have_css('.geojson-svg')
      end

      it "restores shapefile search constraints" do
        expect(page).to have_css('.leaflet-overlay-pane path')
      end
    end

    context "upon creating a new constraint" do
      before :all do
        create_point
      end

      after :all do
        upload_shapefile('doc/example-data/shapefiles/simple.geojson')
        choose_tool_from_map_toolbar('Point')
      end

      it "keeps the shapefile's display hidden" do
        expect(page).to have_no_css('.geojson-svg')
      end

      it "keeps the shapefile's search constraints hidden" do
        expect(page).to have_no_css('.leaflet-overlay-pane path')
      end
    end

  end
end
