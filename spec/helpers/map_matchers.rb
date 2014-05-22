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
