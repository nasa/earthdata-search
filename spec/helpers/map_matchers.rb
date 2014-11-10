module MapUtil
  def self.tiles(node, selector)
    # 'visible: false' because leaflet fails to load the tiles and therefore keeps them hidden
    node.all("#{selector} img.leaflet-tile", visible: false)
  end

  def self.spatial(page)
    page.evaluate_script('edsc.models.page.current.query.spatial()')
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
      puts "#{img['src']} vs #{expected}" unless img['src'] =~ /TIME=#{expected}/
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

RSpec::Matchers.define :have_map_center do |expected_lat, expected_lng|
  match do |page|
    synchronize do
      query = URI.parse(page.current_url).query
      lat = query.split('!')[0].split('=')[1].to_f
      lng = query.split('!')[1].to_f
      delta = 0.5

      expect(lat).to be_within(delta).of(expected_lat)
      expect(lng).to be_within(delta).of(expected_lng)
    end
  end
end
