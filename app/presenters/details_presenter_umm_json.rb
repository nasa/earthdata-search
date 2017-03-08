class DetailsPresenterUmmJson
  def temporal(metadata_temporal)
    # TODO: Hopefully this works but I'm not sure if it covers all cases
    temporal = []
    if metadata_temporal && metadata_temporal.is_a?(Hash)
      parse_temporal(metadata_temporal, temporal)
    elsif metadata_temporal && metadata_temporal.is_a?(Array)
      metadata_temporal.each { |t| parse_temporal(t, temporal) }
    else
      temporal << 'Not available'
    end
    temporal
  end

  def parse_temporal(metadata, temporal)
    temporal_range_type = metadata.fetch('TemporalRangeType', '')
    ends_at_present_flag = metadata.fetch('EndsAtPresentFlag', false)
    if temporal_range_type == 'SingleDateTime'
      # Single temporal
      date = "#{metadata.fetch('SingleDateTime', '').split('T')[0]}"
      date += ' ongoing' if ends_at_present_flag
      temporal << date
    else
      # Multiple temporal
      metadata.fetch('RangeDateTimes', []).each do |range_date_time|
        if temporal_range_type == 'Continuous Range'
          beginning_date_time = range_date_time.fetch('BeginningDateTime', '').split('T')[0]
          ending_date_time = range_date_time.fetch('EndingDateTime', '').split('T')[0]

          if ends_at_present_flag || ending_date_time.blank?
            date = "#{beginning_date_time} ongoing"
          else
            date = "#{beginning_date_time} to #{ending_date_time}"
          end

          temporal << date
        elsif range_date_time
          Array.wrap(range_date_time).each do |range_date|
            start = range_date.fetch('BeginningDateTime', '').split('T')[0]
            stop = range_date.fetch('EndingDateTime', '').split('T')[0]

            if ends_at_present_flag || stop.blank?
              date = "#{start} ongoing"
            else
              date = "#{start} to #{stop}"
            end
            temporal << date
          end
        end
      end
    end
  end

  def spatial(hash)
    spatial_list = []
    if hash['HorizontalSpatialDomain']
      geometry = hash['HorizontalSpatialDomain']['Geometry']
      if geometry['Points']
        points = Array.wrap(geometry['Points'])
        points.each do |point|
          latitude = point['Latitude']
          longitude = point['Longitude']
          spatial_list << "Point: (#{degrees(latitude)}, #{degrees(longitude)})"
        end
      elsif geometry['BoundingRectangles']
        boxes = Array.wrap(geometry['BoundingRectangles'])
        boxes.each do |box|
          north = box['NorthBoundingCoordinate']
          south = box['SouthBoundingCoordinate']
          east = box['EastBoundingCoordinate']
          west = box['WestBoundingCoordinate']
          spatial_list << "Bounding Rectangle: (#{degrees(north)}, #{degrees(west)}, #{degrees(south)}, #{degrees(east)})"
        end
      elsif geometry['GPolygons']
        polygons = Array.wrap(geometry['GPolygons'])
        polygons.each do |polygon|
          s = 'Polygon: ('
          polygon['Boundary'].each do |point|
            point[1].each_with_index do |p, i|
              latitude = p['PointLatitude']
              longitude = p['PointLongitude']
              s += "(#{degrees(latitude)}, #{degrees(longitude)})"
              s += ', ' if i + 1 < point[1].size
            end
          end
          s += ')'
          spatial_list << s
        end
      elsif geometry['Lines']
        lines = Array.wrap(geometry['Lines'])
        lines.each do |line|
          latitude1 = line['Point'][0]['PointLatitude']
          longitude1 = line['Point'][0]['PointLongitude']
          latitude2 = line['Point'][1]['PointLatitude']
          longitude2 = line['Point'][1]['PointLongitude']
          spatial_list << "Line: ((#{degrees(latitude1)}, #{degrees(longitude1)}), (#{degrees(latitude2)}, #{degrees(longitude2)}))"
        end
      else
        spatial_list = ['Not available']
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
