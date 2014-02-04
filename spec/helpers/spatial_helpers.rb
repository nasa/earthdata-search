module Helpers
  module SpatialHelpers

    def choose_tool_from_site_toolbar(name)
      # CSS mouseovers in capybara are screwy, so this is a bit of a hack
      # And selenium freaks out if we try to use jQuery to do this
      # We resort to dealing directly with the click handler
      script = "edsc.models.page.current.ui.spatialType.select#{name}()"
      page.evaluate_script(script)
    end

    def choose_tool_from_map_toolbar(name)
      within '#map' do
        click_link "Search by spatial #{name.downcase}"
      end
    end

    def create_point(lat=0, lon=0)
      create_spatial('point', [lat, lon])
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

    def clear_spatial
      script = """
        edsc.models.page.current.query.spatial(null);
        edsc.models.page.current.ui.spatialType.selectNone();
      """
      page.evaluate_script(script)
    end

    def upload_shapefile(path)
      script = "$('input[type=file]').css({visibility: 'visible', height: '28px', width: '300px', position: 'absolute', 'z-index':500000}).show().attr('name', 'shapefile')"
      page.evaluate_script(script)

      attach_file('shapefile', Rails.root.join(path))

      clear_spatial
      clear_popover
    end

    def clear_popover
      page.evaluate_script('edsc.help.close()')
    end

    def clear_shapefile
      begin
        click_link "Remove file"
        page.should have_no_css(".dz-file-preview")
      rescue Capybara::ElementNotFound
      end
    end

    private

    def create_spatial(type, *points)
      point_strs = points.map {|p| p.reverse.join(',')}
      script = "edsc.models.page.current.query.spatial('#{type}:#{point_strs.join(':')}')"
      page.evaluate_script(script)
    end


  end
end
