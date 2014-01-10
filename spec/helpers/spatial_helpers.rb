module Helpers
  module SpatialHelpers

    def choose_tool_from_site_toolbar(name)
      # CSS mouseovers in capybara are screwy, so this is a bit of a hack
      # And selenium freaks out if we try to use jQuery to do this
      # We resort to dealing directly with the click handler
      script = "edsc.models.searchModel.ui.spatialType.select#{name}()"
      page.evaluate_script(script)
    end

    def choose_tool_from_map_toolbar(name)
      within '#map' do
        click_link "Search by spatial #{name.downcase}"
      end
    end

    def create_point(lat=0, lon=0)
      script = "edsc.models.searchModel.query.spatial('point:#{lon},#{lat}')"
      page.evaluate_script(script)
    end

    def create_bounding_box(lat0=0, lon0=0, lat1=10, lon1=10)
      script = "edsc.models.searchModel.query.spatial('bounding_box:#{lon0},#{lat0}:#{lon1},#{lat1}')"
      page.evaluate_script(script)
    end

    def create_polygon(*points)
      point_strs = points.map {|p| p.reverse.join(',')}
      script = "edsc.models.searchModel.query.spatial('polygon:#{point_strs.join(':')}')"
      page.evaluate_script(script)
    end

    def clear_spatial
      script = "edsc.models.searchModel.query.spatial(null)"
      page.evaluate_script(script)
    end

  end
end
