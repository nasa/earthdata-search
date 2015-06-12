module MapUtil
  def self.set_zoom(page, zoom)
    page.evaluate_script("(function() {
      var map = $('#map').data('map').map;
      return map.setZoom(#{zoom});
      })();")
  end

  def self.get_zoom(page)
    page.evaluate_script("(function() {
      var map = $('#map').data('map').map;
      return map.getZoom();
      })();")
  end

  def self.get_transform_offset(page)
    puts "------- #{page.find(".leaflet-map-pane")[:style]}"
    page.find(".leaflet-map-pane")[:style]
  end
end