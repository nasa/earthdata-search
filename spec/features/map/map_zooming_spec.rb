require 'spec_helper'

describe 'Map Zooming' do
  before :each do
    load_page :search
  end

  context 'when zooming with the zoom buttons' do
    context 'and the overlay is visible' do
      before :each do
        find('.leaflet-control-zoom-in').click
      end

      it 'zooms to the center of the visible map' do
        expect(page).to have_map_center(0, 0, 3)
      end
    end

    context 'and the overlay is minimized' do
      before :each do
        within '.master-overlay-main' do
          find('.master-overlay-minimize').click
        end

        zoom_level = MapUtil.get_zoom(page)
        find('.leaflet-control-zoom-in').click
        wait_for_zoom_animation(zoom_level + 1)
      end

      it 'zooms to the center of the visible map' do
        expect(page).to have_map_center(0, 0, 3)
      end
    end
  end

  context 'when using the zoom home button' do
    context 'with spatial bounds' do
      before :each do
        script = "$('#map').data('map').map.fitBounds([{lat: -40, lng:0}, {lat: -20, lng: 0}]);"
        page.execute_script(script)

        create_bounding_box(0, 0, 20, 20)

        find('.leaflet-control-zoom-home').click
      end

      it 'centers the map over the spatial area' do
        expect(page).to have_map_center(10, 10, 4)
      end
    end

    context 'without spatial bounds' do
      before :each do
        script = "$('#map').data('map').map.fitBounds([{lat: -40, lng:-10}, {lat: -20, lng: -10}]);"
        page.execute_script(script)

        find('.leaflet-control-zoom-home').click
      end

      it 'centers the map at (0,0)' do
        expect(page).to have_map_center(0, 0, 2)
      end
    end

    context 'on polar view' do
      before :each do
        find('#collection-results').find_link('Minimize').click
        wait_for_xhr
      end

      it 'centers the map at (90, 0) for north polar view' do
        click_on 'North Polar Stereographic'
        wait_for_xhr
        expect(page).to have_map_center(90, 0, 0)
      end

      it 'centers the map at (-90, 0) for south polar view' do
        click_on 'South Polar Stereographic'
        wait_for_xhr
        expect(page).to have_map_center(-90, 0, 0)
      end
    end
  end

  context 'on geo view' do
    context 'at the minimum zoom level' do
      before :each do
        click_on 'Geographic (Equirectangular)'
        MapUtil.set_zoom(page, 0)
      end

      context 'clicking zoom out' do
        before :each do
          find('.leaflet-control-zoom-out').click
          wait_for_zoom_animation(0)
          wait_for_xhr
        end

        it 'maintains the map center' do
          expect(page).to have_map_center(0, 0, 0)
        end

        it 'does not zoom out any further' do
          expect(MapUtil.get_zoom(page)).to eql(0)
        end
      end
    end

    context 'at the maximum zoom level' do
      before :each do
        MapUtil.set_zoom(page, 8)
      end

      context 'clicking zoom out' do
        before :each do
          find('.leaflet-control-zoom-in').click
          wait_for_zoom_animation(8)
        end

        it 'maintains the map center' do
          expect(page).to have_map_center(0, 0, 8)
        end

        it 'does not zoom in any further' do
          expect(MapUtil.get_zoom(page)).to eql(8)
        end
      end
    end
  end

  context 'on north polar view ' do
    context 'at the maximum zoom level' do
      before :each do
        click_on 'North Polar Stereographic'
        MapUtil.set_zoom(page, 4)
      end

      context 'clicking zoom in' do
        before :each do
          find('.leaflet-control-zoom-in').click
        end

        it 'does not zoom in any further' do
          expect(MapUtil.get_zoom(page)).to eql(4)
        end

        it 'maintains the map center' do
          expect(page).to have_map_center(90, 0, 4)
        end
      end
    end
  end

  context 'on south polar view ' do
    context 'at the maximum zoom level' do
      before :each do
        click_on 'South Polar Stereographic'
        MapUtil.set_zoom(page, 4)
      end

      context 'clicking zoom in' do
        before :each do
          find('.leaflet-control-zoom-in').click
        end

        it 'does not zoom in any further' do
          expect(MapUtil.get_zoom(page)).to eql(4)
        end

        it 'maintains the map center' do
          expect(page).to have_map_center(-90, 0, 4)
        end
      end
    end
  end
end
