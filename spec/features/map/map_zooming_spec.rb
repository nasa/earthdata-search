require 'spec_helper'

describe 'Map Zooming', reset: false do
  before :all do
    page.driver.resize_window(1680, 1050) # Default capybara window size
    Capybara.reset_sessions!
    visit '/search'
  end

  after :all do
    page.driver.resize_window(1280, 1024)
  end

  # context 'when zooming with the mouse scroll wheel' do
  #   before :all do
  #     # zoom in with mouse
  #     script = '''
  #       # couldn't find anything that worked here
  #     '''
  #     page.evaluate_script script
  #   end
  #
  #   after :all do
  #     # zoom out with mouse
  #     expect(page).to have_query_string('m=0!0!2!1')
  #   end
  #
  #   it 'zooms to the mouse location' do
  #     expect(page).to have_query_string('m=15!15!3!1')
  #   end
  # end

  context 'when zooming with the zoom buttons' do
    context 'and the overlay is visible' do
      before :all do
        visit '/search'
        find('.leaflet-control-zoom-in').click
        wait_for_xhr
        sleep 0.2 # Allow animations to finish and avoid clickfailed
      end

      after :all do
        find('.leaflet-control-zoom-out').click
        wait_for_xhr
        expect(page).to have_map_center(0, 0, 2)
      end

      it 'zooms to the center of the visible map' do
        expect(page).to have_map_center(0, 31, 3)
      end
    end

    context 'and the overlay is minimized' do
      before :all do
        within '.master-overlay-main' do
          find('.master-overlay-minimize').click
        end
        wait_for_xhr
        find('.leaflet-control-zoom-in').click
        wait_for_xhr
      end

      after :all do
        synchronize do
          # Synchronize because animations can cause occlusion if execution is very fast
          find('.leaflet-control-zoom-out').click
          find('.master-overlay-maximize').click
        end
        wait_for_xhr
        expect(page).to have_map_center(0, 0, 2)
      end

      it 'zooms to the center of the visible map' do
        expect(page).to have_map_center(0, 19.6, 3)
      end
    end
  end

  context 'when using the zoom home button' do
    context 'with spatial bounds' do
      before :all do
        visit '/search'
        script = "$('#map').data('map').map.fitBounds([{lat: -40, lng:0}, {lat: -20, lng: 0}]);"
        page.execute_script(script)

        create_bounding_box(0, 0, 20, 20)

        find('.leaflet-control-zoom-home').click
      end

      after :all do
        click_on 'Clear Filters'
        script = "$('#map').data('map').map.setView([0, 0], 2);"
        page.execute_script(script)
        expect(page).to have_map_center(0, 0, 2)
      end

      it "centers the map over the spatial area" do
        expect(page).to have_map_center(10, -6, 4)
      end
    end

    context 'without spatial bounds' do
      before :all do
        script = "$('#map').data('map').map.fitBounds([{lat: -40, lng:-10}, {lat: -20, lng: -10}]);"
        page.execute_script(script)

        find('.leaflet-control-zoom-home').click
      end

      after :all do
        script = "$('#map').data('map').map.setView([0, 0], 2);"
        page.execute_script(script)
        expect(page).to have_map_center(0, 0, 2)
      end

      it "centers the map at (0,0)" do
        expect(page).to have_map_center(0, 0, 2)
      end
    end

    context "on polar view" do
      after :all do
        find('.projection-switcher-geo').click
        script = "$('#map').data('map').map.setView([0, 0], 2);"
        page.execute_script(script)
        expect(page).to have_map_center(0, 0, 2)
      end

      it "centers the map at (90, 0) for north polar view" do
        find('.projection-switcher-arctic').click
        expect(page).to have_map_center(90, 0, 0)
      end

      it "centers the map at (-90, 0) for south polar view" do
        find('.projection-switcher-antarctic').click
        expect(page).to have_map_center(-90, 0, 0)
      end
    end
  end

  context 'on geo view' do
    context 'at the minimum zoom level' do
      before :all do
        visit '/search'
        MapUtil.set_zoom(page, 0)
      end

      after :all do
        find('.leaflet-control-zoom-home').click
        wait_for_zoom_animation(2)
      end

      context 'clicking zoom out' do
        before :all do
          find('.leaflet-control-zoom-out').click
          wait_for_zoom_animation(0)
        end

        after :all do
          find('.leaflet-control-zoom-home').click
          wait_for_zoom_animation(2)
        end

        it 'maintains the map center' do
          expect(page).to have_map_center(0, -125, 0)
        end

        it 'does not zoom out any further' do
          expect(MapUtil.get_zoom(page)).to eql(0)
        end
      end
    end

    context 'at the maximum zoom level' do
      before :all do
        MapUtil.set_zoom(page, 7)
      end

      after :all do
        find('.leaflet-control-zoom-home').click
        wait_for_zoom_animation(2)
      end

      context 'clicking zoom out' do
        before :all do
          find('.leaflet-control-zoom-in').click
          wait_for_zoom_animation(7)
        end

        after :all do
          find('.leaflet-control-zoom-home').click
          wait_for_zoom_animation(2)
        end

        it 'maintains the map center' do
          expect(page).to have_map_center(0, 2, 7)
        end

        it 'does not zoom in any further' do
          expect(MapUtil.get_zoom(page)).to eql(7)
        end
      end
    end
  end



  context 'on polar view (e.g. EPSG3031 - South Polar Stereographic)' do
    context 'at the maximum zoom level' do
      before :all do
        find('.projection-switcher-arctic').click
        MapUtil.set_zoom(page, 4)
      end

      after :all do
        find('.projection-switcher-geo').click
      end

      context 'clicking zoom in' do
        before :all do
          find('.leaflet-control-zoom-in').click
        end

        it 'does not zoom in any further' do
          expect(MapUtil.get_zoom(page)).to eql(4)
        end

        it 'maintains the map center' do
          expect(page).to have_map_center(88, 45, 4)
        end
      end
    end
  end
end
