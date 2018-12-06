require 'spec_helper'

describe 'Spatial tool' do
  before :all do
    load_page :search

    # JS: Move the panel out of the way
    click_link 'Minimize'
  end

  let(:spatial_dropdown) do
    page.find('#main-toolbar .filter-stack')
  end

  let(:point_button)     { page.find('#map .leaflet-draw-draw-marker') }
  let(:rectangle_button) { page.find('#map .leaflet-draw-draw-rectangle') }
  let(:polygon_button)   { page.find('#map .leaflet-draw-draw-polygon') }

  context 'selection' do
    context 'when no tool is currently selected' do
      context 'choosing the point selection tool from the site toolbar' do
        before(:each) { choose_tool_from_site_toolbar('Point') }

        it 'selects the point selection tool in both toolbars' do
          expect(spatial_dropdown).to have_text('Point')
          expect(point_button).to have_class('leaflet-draw-toolbar-button-enabled')
        end
      end

      context 'choosing the point selection tool from the map toolbar' do
        before(:each) { choose_tool_from_map_toolbar('Coordinate') }

        it 'selects the point selection tool in both toolbars' do
          expect(spatial_dropdown).to have_text('Point')
          expect(point_button).to have_class('leaflet-draw-toolbar-button-enabled')
        end
      end
    end

    context 'when another tool is currently selected' do
      before(:each) { choose_tool_from_map_toolbar('Rectangle') }

      context 'choosing the point selection tool in the site toolbar' do
        before(:each) { choose_tool_from_site_toolbar('Point') }

        it 'selects the point selection tool in both toolbars' do
          expect(spatial_dropdown).to have_text('Point')
          expect(point_button).to have_class('leaflet-draw-toolbar-button-enabled')
        end
      end

      context 'choosing the point selection tool in the map toolbar' do
        before(:each) { choose_tool_from_map_toolbar('Coordinate') }

        it 'selects the point selection tool in both toolbars' do
          expect(spatial_dropdown).to have_text('Point')
          expect(point_button).to have_class('leaflet-draw-toolbar-button-enabled')
        end
      end
    end

    context 'choosing a tool when a point is already selected' do
      before(:each) do
        create_point
        choose_tool_from_map_toolbar('Rectangle')
      end

      it 'removes the point from the map' do
        expect(page).to have_no_css('#map .leaflet-marker-icon')
      end

      context 'and clicking "Cancel"' do
        before(:each) do
          within "#map" do
            click_link "Cancel"
          end
        end

        it 'adds the removed point back to the map' do
          expect(page).to have_css('#map .leaflet-marker-icon')
        end
      end
    end

    context 'canceling the point selection in the toolbar' do
      before(:each) do
        choose_tool_from_map_toolbar('Coordinate')
        within '#map' do
          click_link 'Cancel'
        end
      end

      it 'deselects the point selection tool in the site toolbar' do
        expect(spatial_dropdown).to have_text('Point')
      end
    end
  end
end

describe 'Spatial' do
  before :each do
    load_page :search
  end

  context 'point selection' do
    it 'displays point coordinates in the manual entry text box' do
      manually_create_point(67, -155)
      wait_for_xhr

      expect(page).to have_field('manual-coord-entry-point', with: '67,-155')
    end

    context 'changing the point selection' do
      before(:each) do
        manually_create_point(0, 0)
        wait_for_xhr

        # expect(page).to have_field('manual-coord-entry-point', with: '0,0')

        manually_create_point(-75, 40)
        wait_for_xhr
      end

      it 'updates the coordinates in the manual entry box' do
        expect(page).to have_field('manual-coord-entry-point', with: '-75,40')
      end

      # it 'pans map to the point' do
      #   expect(page).to have_map_center(-92, 39, 2)
      # end
    end

    context 'removing the point selection' do
      before(:each) do
        manually_create_point(0, 0)
        wait_for_xhr
        clear_spatial
        wait_for_xhr
      end

      # it 'removes the spatial point in the manual entry box' do
      #   expect(page).not_to have_field('manual-coord-entry-point', with: '0,0')
      # end

      # TODO: RDA // Setting a point at 0,0 does not go to 0,0 (inspecting `m`)
      # it 'pans map to the point' do
      #   expect(page).to have_map_center(0, 0, 2)
      # end
    end
  end

  context 'bounding box selection' do
    it 'filters collections using the selected bounding box' do
      manually_create_bounding_box(0, 0, 10, 10)
      wait_for_xhr
      expect(page).to have_no_content('15 Minute Stream Flow Data: USGS')
      expect(page).to have_content('MODIS/Aqua Aerosol 5-Min L2 Swath 3km')
    end

    it 'displays bounding box points in the manual entry text boxes' do
      expect(page).not_to have_field('manual-coord-entry-swpoint', with: '0,0')
      expect(page).not_to have_field('manual-coord-entry-nepoint', with: '10,10')
    end

    context 'changing the bounding box selection' do
      before(:each) do
        manually_create_bounding_box(0, 0, 10, 10)
        wait_for_xhr

        manually_create_bounding_box(69, -174, 72, -171)
        wait_for_xhr
      end

      it 'updates the coordinates in the manual entry text boxes' do
        expect(page).to have_field('manual-coord-entry-swpoint', with: '69,-174')
        expect(page).to have_field('manual-coord-entry-nepoint', with: '72,-171')
      end

      it 'updates the collection filters using the new bounding box selection' do
        expect(page).to have_content('MODIS/Aqua Aerosol 5-Min L2 Swath 3km')
      end
    end

    context 'removing the bounding box selection' do
      before(:each) do
        manually_create_bounding_box(0, 0, 10, 10)
        wait_for_xhr
        clear_spatial
        wait_for_xhr
      end

      it 'removes the spatial point in the manual entry text boxes' do
        expect(page).not_to have_field('manual-coord-entry-swpoint', with: '0,0')
        expect(page).not_to have_field('manual-coord-entry-nepoint', with: '10,10')
      end

      it 'removes the spatial bounding box collection filter' do
        expect(page).to have_content('Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050')
      end
    end

    context 'clearing filters' do
      before :each do
        manually_create_bounding_box(0, 0, 10, 10)
        wait_for_xhr
        click_on 'Clear Filters'
        wait_for_xhr
      end

      it 'removes the spatial point in the manual entry text boxes' do
        expect(page).not_to have_field('manual-coord-entry-swpoint')
        expect(page).not_to have_field('manual-coord-entry-nepoint')
      end

      context 'using the manual entry text boxes to enter a new SW point' do
        before :each do

          # JS: Get panel out of the way
          click_link 'Minimize'

          click_on 'Search by spatial rectangle'
          fill_in 'manual-coord-entry-swpoint', with: "0,0\t"
        end

        it 'does not display the old NE point values' do
          expect(page).not_to have_field('manual-coord-entry-nepoint', with: '10,10')
        end
      end
    end

    context 'loading a bounding box selection over the antimeridian' do
      before :each do
        visit '/search?m=-29.25!-199.40625!0!1&sb=160%2C20%2C-170%2C40'
        wait_for_xhr
      end

      it 'shows the bounding box crossing the antimeridian' do
        script = """
            var layers = $('#map').data('map').map._layers, key, layer, latlngs, result;
            for (key in layers) {
              if (layers[key].type == 'rectangle') {
                layer = layers[key];
                break;
              }
            }
            if (!layer) {
              result = false;
            }
            else {
              latlngs = layer.getLatLngs();
              result = latlngs[0][0].lng + ',' + latlngs[0][2].lng;
            }
            return result;
          """
          result = page.execute_script(script)
          expect(result).to eq('160,190')
      end
    end

    it 'filters collections using north polar bounding boxes in the north polar projection' do
      click_link 'North Polar Stereographic'
      manually_create_arctic_rectangle(-10, -10, 10, 10)
      wait_for_xhr

      expect(page).to have_no_content('15 Minute Stream Flow Data: USGS')
      expect(page).to have_content('MODIS/Aqua Aerosol 5-Min L2 Swath 3km')
    end

    it 'filters collections using south polar bounding boxes in the south polar projection' do
      click_link 'South Polar Stereographic'
      manually_create_antarctic_rectangle(-10, -10, 10, 10)
      wait_for_xhr

      expect(page).to have_no_content('15 Minute Stream Flow Data: USGS')
      expect(page).to have_content('MODIS/Aqua Aerosol 5-Min L2 Swath 3km')
    end
  end

  context 'polygon selection', pending_updates: true do
    # We need to figure out a non-js way of creating a polygon
    it 'doesn\'t show manual input text box' do
      expect(page).not_to have_field('manual-coord-entry-container')
    end

    it 'filters collections using the selected polygon' do
      create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
      wait_for_xhr
      expect(page).to have_no_content('15 Minute Stream Flow Data: USGS')
      expect(page).to have_content('NCEP/DOE Reanalysis II, for GSSTF, 0.25 x 0.25 deg, Daily Grid V3 (GSSTF_NCEP) at GES DISC')
    end

    it 'displays errors for invalid polygons' do
      create_polygon([10, 10], [-10, -10], [10, -10], [-10, 10])
      wait_for_xhr
      expect(page).to have_content('The polygon boundary intersected itself at the following points:')
    end

    context 'changing the polygon selection' do
      before(:each) do
        create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
        wait_for_xhr
        expect(page).to have_content('MODIS/Aqua Aerosol 5-Min L2 Swath 3km')
        create_polygon([77, -165], [72, -173], [67, -168], [69, -159])
        wait_for_xhr
      end

      it 'updates the collection filters using the new bounding box selection' do
        expect(page).to have_no_content('Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050')
      end
    end

    context 'removing the bounding box selection' do
      before(:each) do
        create_polygon([10, 10], [10, -10], [-10, -10], [-10, 10])
        wait_for_xhr

        clear_spatial
        wait_for_xhr
      end

      it 'removes the spatial bounding box collection filter' do
        expect(page).to have_content('Global Maps of Atmospheric Nitrogen Deposition, 1860, 1993, and 2050')
      end
    end
  end
end
