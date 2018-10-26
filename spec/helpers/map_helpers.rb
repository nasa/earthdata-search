module MapUtil
  def self.set_zoom(page, zoom)
    page.execute_script("
      var map = $('#map').data('map').map;
      return map.setZoom(#{zoom});
      ")
  end

  def self.get_zoom(page)
    page.execute_script("
      var map = $('#map').data('map').map;
      return map.getZoom();
      ")
  end
end
