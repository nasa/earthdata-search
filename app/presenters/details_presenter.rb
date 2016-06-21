class DetailsPresenter

  def temporal(hash)
    if hash && hash['RangeDateTime']
      # some collections may have multiple temporal fields when retrieved in echo10 format. CMR returns the date time
      # from elasticsearch where latest and earliest times are indexed.
      if hash['RangeDateTime'].is_a? Array
        start_time = hash['RangeDateTime'].map{|range| DateTime.parse(range['BeginningDateTime']) if range['BeginningDateTime'].present?}.compact.min
        end_time = hash['RangeDateTime'].map{|range| DateTime.parse(range['EndingDateTime']) if range['EndingDateTime'].present?}.compact.max
        "#{start_time} to #{end_time}"
      else
        "#{hash['RangeDateTime']['BeginningDateTime']} to #{hash['RangeDateTime']['EndingDateTime']}"
      end
    else
      'Not available'
    end
  end

  def spatial(hash)
    if hash
      spatial_list = hash.map do |h|
        spatial = []

        if h['HorizontalSpatialDomain']
          geometry = h['HorizontalSpatialDomain']['Geometry']
          if geometry['Point']
            points = Array.wrap(geometry['Point'])

            points.each do |point|
              latitude = point['PointLatitude']
              longitude = point['PointLongitude']
              spatial << "Point: (#{degrees(latitude)}, #{degrees(longitude)})"
            end

          elsif geometry['BoundingRectangle']
            boxes = Array.wrap(geometry['BoundingRectangle'])

            boxes.each do |box|
              north = box['NorthBoundingCoordinate']
              south = box['SouthBoundingCoordinate']
              east = box['EastBoundingCoordinate']
              west = box['WestBoundingCoordinate']
              spatial << "Bounding Rectangle: (#{degrees(north)}, #{degrees(west)}, #{degrees(south)}, #{degrees(east)})"
            end
          elsif geometry['GPolygon']
            polygons = Array.wrap(geometry['GPolygon'])

            polygons.each do |polygon|
              s = "Polygon: ("
              polygon['Boundary'].each do |point|
                point[1].each_with_index do |p, i|
                  latitude = p['PointLatitude']
                  longitude = p['PointLongitude']
                  s += "(#{degrees(latitude)}, #{degrees(longitude)})"
                  s += ", " if i+1 < point[1].size
                end
              end
              s += ")"
              spatial << s
            end

          elsif geometry['Line']
            lines = Array.wrap(geometry['Line'])

            lines.each do |line|
              latitude1 = line['Point'][0]['PointLatitude']
              longitude1 = line['Point'][0]['PointLongitude']
              latitude2 = line['Point'][1]['PointLatitude']
              longitude2 = line['Point'][1]['PointLongitude']
              spatial << "Line: ((#{degrees(latitude1)}, #{degrees(longitude1)}), (#{degrees(latitude2)}, #{degrees(longitude2)}))"
            end
          else
            spatial = ['Not available']
          end
        else
          spatial = ['Not available']
        end

        spatial
      end
    else
      spatial_list = ['Not available']
    end

    spatial_list.flatten
  end

  def degrees(text)
    "#{text}\xC2\xB0"
  end

  private

  def client_id(env)
    services = Rails.configuration.services
    config = services['earthdata'][env]
    services['urs'][Rails.env.to_s][config['urs_root']]
  end

end
