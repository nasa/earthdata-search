module Helpers
  module SpatialHelpers
    def choose_tool_from_site_toolbar(name)
      page.find('.spatial-dropdown-button').click
      within('ul.spatial-selection') do
        page.find('a', class: "select-#{name.downcase}").click
      end
    end

    def choose_tool_from_map_toolbar(name)
      within '#map' do
        click_link "Search by spatial #{name.downcase}"
      end
    end

    def manually_create_point(lat=0, lon=0)
      choose_tool_from_site_toolbar('Point')

      fill_in 'manual-coord-entry-point', with: "#{lat},#{lon}"
      page.find('body').click
    end

    def create_point(lat=0, lon=0)
      create_spatial('point', [lat, lon])
    end

    def manually_create_bounding_box(swlat=0, swlon=0, nelat=0, nelon=0)
      choose_tool_from_site_toolbar('Rectangle')

      fill_in 'manual-coord-entry-swpoint', with: "#{swlat},#{swlon}"
      fill_in 'manual-coord-entry-nepoint', with: "#{nelat},#{nelon}"

      page.find('body').click
      wait_for_xhr
    end

    def create_bounding_box(lat0=0, lon0=0, lat1=10, lon1=10)
      create_spatial('bounding_box', [lat0, lon0], [lat1, lon1])
    end

    def create_polygon(*points)
      create_spatial('polygon', *points)
    end

    def create_arctic_rectangle(*points)
      create_spatial('arctic-rectangle', *points)
    end

    def create_antarctic_rectangle(*points)
      create_spatial('antarctic-rectangle', *points)
    end

    def manually_create_arctic_rectangle(*points)
      find('.projection-switcher-arctic').click
      wait_for_xhr

      manually_create_bounding_box(*points)
    end

    def manually_create_antarctic_rectangle(*points)
      find('.projection-switcher-antarctic').click
      wait_for_xhr

      manually_create_bounding_box(*points)
    end

    def clear_spatial
      if page.has_link?('Clear spatial constraint')
        page.find('a[title="Clear spatial constraint"]').click

        wait_for_xhr
      end
    end

    def upload_shapefile(path)
      clear_spatial

      script = "$('input[type=file]').css({visibility: 'visible', height: '28px', width: '300px', position: 'absolute', 'z-index':500000}).show().attr('name', 'shapefile')"
      page.execute_script(script)

      attach_file('shapefile', Rails.root.join(path))
      wait_for_xhr
    end

    def clear_shapefile
      begin
        click_link "Remove file"
        page.should have_no_css(".dz-file-preview")
      rescue Capybara::ElementNotFound
      end
    end

    def map_mousemove(*args)
      map_position_event('mousemove', *args)
      wait_for_xhr
    end

    def map_mouseout(*args)
      map_position_event('mouseout', *args)
      wait_for_xhr
    end

    def map_mouseclick(*args)
      find('.landing-toolbar-container').click # Ensure the capybara cursor is in a reasonable place
      # Popover code requires the mouse to be over the map
      map_position_event('mousemove', *args)
      map_position_event('click', *args)
      map_position_event('mouseout', *args)
      wait_for_xhr
    end

    private

    def map_position_event(event, selector='#map', lat=10, lng=10, x=10, y=10)
      script = """
        var target = $('#{selector}')[0];
        var map = window.edsc.page.map.map;
        var latLng = L.latLng(#{lat}, #{lng});
        var e = {
          containerPoint: map.latLngToContainerPoint(latLng),
          originalEvent: {
            target: target
          },
          layerPoint: map.latLngToLayerPoint(latLng),
          latlng: latLng};
        map.fire('#{event}', e);
      """
      page.execute_script(script)
    end

    def create_spatial(type, *points)
      point_strs = points.map {|p| p.reverse.join(',')}
      script = "edsc.models.page.current.query.spatial('#{type}:#{point_strs.join(':')}')"
      page.execute_script(script)
    end
  end
end
