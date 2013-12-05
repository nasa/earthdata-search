module TileUtil
  def self.tiles(node, selector)
    # 'visible: false' because leaflet fails to load the tiles and therefore keeps them hidden
    node.all("#{selector} .leaflet-tile", visible: false)
  end
end

RSpec::Matchers.define :have_tiles_with_projection do |expected|
  match do |selector|
    TileUtil.tiles(page, selector).any? do |img|
      img['src'] =~ /TILEMATRIXSET=#{expected}/
    end
  end
end

RSpec::Matchers.define :have_tiles_with_zoom_level do |expected|
  match do |selector|
    TileUtil.tiles(page, selector).any? do |img|
      img['src'] =~ /TILEMATRIX=#{expected}/
    end
  end
end
