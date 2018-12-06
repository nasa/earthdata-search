module MapUtil
  def self.set_zoom(page, zoom)
    page.execute_script("$('#map').data('map').map.setZoom(#{zoom});")
  end

  def self.get_zoom(page)
    page.execute_script("return $('#map').data('map').map.getZoom();")
  end
end
