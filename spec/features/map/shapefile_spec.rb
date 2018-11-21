require 'spec_helper'

describe 'Shapefile search' do
  before :all do
    load_page :search
  end

  context 'when uploading a file which format is not supported', pending_updates: true do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/invalid_format.mp4')
    end

    after :all do
      clear_shapefile
    end

    it 'displays an error icon and an error message' do
      expect(page).to have_css('.dz-error-message')
      expect(page).to have_css('.dz-error-mark')
    end
  end

  context 'when uploading a single .shp file as ESRI Shapefile' do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/single_shp.shp')
    end

    after :all do
      clear_shapefile
    end

    it 'displays an error icon and a custom error message' do
      expect(page).to have_css('.dz-error-mark')
      expect(page).to have_text('To use an ESRI Shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.')
    end
  end

  context 'when uploading a shapefile containing multiple features' do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/complex.geojson')
    end

    after :all do
      clear_shapefile
    end

    it 'displays the shapefile\'s features' do
      expect(page).to have_css('.geojson-svg')
      expect(page).to have_css('.geojson-icon')
    end

    context 'when clicking on a feature' do
      before :all do
        page.execute_script("$('.geojson-svg').first().mapClick()")
      end

      after :all do
        clear_spatial
      end

      it 'sets the feature as the current search constraint' do
        expect(page).to have_spatial_constraint('polygon:102,0:103,1:104,0:105,1')
      end

      it 'hides the help message prompting the user to select a feature' do
        expect(page).to have_no_popover('Choose a Search Constraint')
      end
    end
  end

  context 'when uploading a simple shapefile which points can be simplified' do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/shape_with_redundancies.zip')
    end

    after :all do
      clear_shapefile
      clear_spatial
    end

    it 'doesn\'t display a help message explaining the point reduction' do
      expect(page).not_to have_popover('Shape file has too many points')
    end
  end

  context 'when uploading a shapefile containing a single feature' do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/simple.geojson')
    end

    after :all do
      clear_shapefile
      clear_spatial
    end

    context 'removing the file and uploading another one' do
      before :all do
        click_link 'Remove file'
        upload_shapefile('doc/example-data/shapefiles/shape_with_redundancies.zip')
      end

      after :all do
        clear_shapefile
        clear_spatial

        upload_shapefile('doc/example-data/shapefiles/simple.geojson')
      end

      it 'keeps the latest shape file on map' do
        expect(page).to have_css('.geojson-svg', count: 1)
      end
    end

    it 'sets the feature as the current search constraint' do
      expect(page).to have_css('.leaflet-overlay-pane path')
      expect(page).to have_spatial_constraint('polygon:100,0:101,0:101,1:100,1')
    end

    it 'displays no help message prompting the user to select a feature' do
      expect(page).to have_css('.leaflet-overlay-pane path')
      expect(page).to have_no_popover('Choose a Search Constraint')
    end

    it 'centers the map over the spatial constraint' do
      script = "return $('#map').data('map').map.getCenter().toString();"
      result = page.execute_script(script)

      lat = result.split('(')[1].split(',')[0].to_f
      lng = result.split(', ')[1].split(')')[0].to_f
      expect(lat).to be_within(0.15).of(0.5)
      expect(lng).to be_within(0.15).of(100.5)
    end

    it 'zooms the map to the spatial constraint', pending_updates: true do
      script = "return $('#map').data('map').map.getZoom();"
      result = page.execute_script(script)

      expect(result).to eq(7)
    end
  end

  context 'when selecting a shapefile feature containing a large number of points' do
    before :all do
      clear_spatial
      clear_shapefile
      expect(page).to have_no_css('.geojson-svg')
      upload_shapefile('doc/example-data/shapefiles/large.geojson')
      expect(page).to have_css('.geojson-svg')
    end

    after :all do
      clear_shapefile
      clear_spatial
    end

    it 'sets a search constraint containing a reduced number of points' do
      expect(MapUtil.spatial(page).split(':').size).to be <= 51
    end

  end

  context 'when removing an uploaded shapefile' do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/simple.geojson')
      expect(page).to have_spatial_constraint('polygon:100,0:101,0:101,1:100,1')
      click_link 'Remove file'
    end

    after :all do
      clear_spatial
    end

    it 'hides the shapefile\'s display' do
      expect(page).to have_no_css('.geojson-svg')
      expect(page).to have_no_css('.geojson-icon')
    end

    it 'keeps search constraints' do
      expect(page).to have_spatial_constraint('polygon:100,0:101,0:101,1:100,1')
    end
  end

  context 'when switching spatial search tools' do
    before :all do
      upload_shapefile('doc/example-data/shapefiles/simple.geojson')
      expect(page).to have_css('.geojson-svg')
      choose_tool_from_map_toolbar('Coordinate')
    end

    after :all do
      within '#map' do
        click_link 'Cancel'
      end
      clear_shapefile
      clear_spatial
    end

    it 'hides the shapefile\'s display' do
      expect(page).to have_no_css('.geojson-svg')
    end

    it 'hides shapefile search constraints' do
      expect(page).to have_no_css('.leaflet-overlay-pane path')
    end

    context 'upon canceling the spatial selection' do
      before :all do
        within '#map' do
          click_link 'Cancel'
        end
      end

      after :all do
        choose_tool_from_map_toolbar('Coordinate')
      end

      it 'restores the shapefile\'s display' do
        expect(page).to have_css('.geojson-svg')
      end

      it 'restores shapefile search constraints' do
        expect(page).to have_css('.leaflet-overlay-pane path')
      end
    end

    context 'upon creating a new constraint' do
      before :all do
        create_point
      end

      after :all do
        upload_shapefile('doc/example-data/shapefiles/simple.geojson')
        wait_for_xhr
        choose_tool_from_map_toolbar('Coordinate')
      end

      it 'keeps the shapefile\'s display hidden' do
        expect(page).to have_no_css('.geojson-svg')
      end

      it 'keeps the shapefile\'s search constraints hidden' do
        expect(page).to have_no_css('.leaflet-overlay-pane path')
      end
    end
  end
end
