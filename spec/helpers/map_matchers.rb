module MapUtil
  def self.tiles(node, selector)
    # 'visible: false' because leaflet fails to load the tiles and therefore keeps them hidden
    node.all("#{selector} img.leaflet-tile", visible: false)
  end

  def self.spatial(page)
    page.evaluate_script('edsc.models.page.current.query.spatial()')
  end
end

RSpec::Matchers.define :have_granule_visualizations do |collection_id|
  match do |selector|
    expect(selector).to have_selector("#granule-vis-#{collection_id} canvas")
  end
end

RSpec::Matchers.define :have_no_granule_visualizations do |collection_id|
  match do |selector|
    expect(selector).to have_no_selector("#granule-vis-#{collection_id} canvas")
  end
end

RSpec::Matchers.define :have_tiles_with_projection do |expected|
  match do |selector|
    MapUtil.tiles(Capybara.current_session, selector).any? do |img|
      img['src'] =~ /TILEMATRIXSET=#{expected}/
    end
  end
end

RSpec::Matchers.define :have_tiles_with_zoom_level do |expected|
  match do |selector|
    MapUtil.tiles(Capybara.current_session, selector).any? do |img|
      img['src'] =~ /TILEMATRIX=#{expected}/
    end
  end
end

RSpec::Matchers.define :have_tiles_with_date do |expected|
  match do |selector|
    MapUtil.tiles(Capybara.current_session, selector).any? do |img|
      img['src'] =~ /TIME=#{expected}/
    end
  end
end

RSpec::Matchers.define :have_tiles_with_no_date do |expected|
  match do |selector|
    !MapUtil.tiles(Capybara.current_session, selector).any? do |img|
      img['src'] =~ /TIME=#{expected}/
    end
  end
end

RSpec::Matchers.define :have_tiles_for_product do |expected|
  match do |selector|
    MapUtil.tiles(Capybara.current_session, selector).any? do |img|
      img['src'] =~ /=#{expected}&/
    end
  end
end

RSpec::Matchers.define :have_spatial_constraint do |expected|
  match do |page|
    synchronize do
      expect(MapUtil.spatial(page)).to eql(expected)
    end
  end

  failure_message_for_should do |page|
    "expected page to have spatial constraint #{expected}, got #{MapUtil.spatial(page)}"
  end
end

RSpec::Matchers.define :have_no_spatial_constraint do |expected|
  match do |page|
    synchronize do
      expect(MapUtil.spatial(page)).to_not eql(expected)
    end
    true
  end

  failure_message_for_should do |page|
    "expected page to not have spatial constraint #{expected}"
  end
end

RSpec::Matchers.define :have_map_center do |expected_lat, expected_lng, expected_zoom|

  def map_params(page)
    #query = URI.parse(page.current_url).query
    #param_str = query[/(?:&|^)m=([\d.!]+)/, 1]
    #param_str.split('!').map(&:to_f) if param_str.present?
    page.evaluate_script("(function() {
       var map = $('#map').data('map').map;
       var center = map.getCenter();
       return [center.lat, center.lng, map.getZoom()];
    })();")
  end

  match do |page|
    synchronize do
      lat, lng, zoom = map_params(page)
      delta = 1

      expect(lat).to be_within(delta).of(expected_lat)
      expect(lng).to be_within(delta).of(expected_lng)
      expect(zoom).to eq(expected_zoom)
    end
  end

  failure_message_for_should do |page|
    "expected page to have map query of 'm=#{expected_lat}!#{expected_lng}!#{expected_zoom}...', got '#{URI.parse(page.current_url).query.inspect}'"
  end
end
