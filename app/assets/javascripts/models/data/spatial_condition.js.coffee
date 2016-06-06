ns = @edsc.models.data

ns.SpatialCondition = do (ko, KnockoutModel=@edsc.models.KnockoutModel) ->
  class SpatialCondition extends KnockoutModel
    constructor: (spatial)->
      @coordinates = ko.observable('')
      @swPoint = ko.observable('')
      @nePoint = ko.observable('')
      @spatialType = ko.observable('')
      @inputWidth = ko.observable(0)
      @previousSpatial = ''
      @previousType = ''
      @visible = ko.observable(spatial().length > 0)

      @error = @computed =>
        coordinates = @coordinates()?.trim()
        if coordinates? && coordinates.length > 0
          coords = coordinates.split(/:/)
          for coord in coords
            ranges = coord.split(',')
            return "Coordinate must be two comma-separated numbers: #{coord}" unless ranges.length == 2
            for range in ranges
              match = range.trim().match(/^-?\d+(\.\d+)?$/)
              unless match?
                return "Invalid coordinate: #{range}"
              [all, min, max] = match
              min = parseInt(min, 10)
              max = parseInt(max, 10)
        null

      @queryCoordinates = @computed =>
        @visible(spatial().length > 0)
        type = spatial().split(':')[0]
        newSpatial = ''

        return null unless !!@previousType || !!spatial()

        if type == @previousType
          if type == 'point'
            @spatialType('Point')
            value = spatial().split(':')[1]
            newSpatial = if @previousSpatial != value then value else @coordinates()
          else if type == 'bounding_box'
            @spatialType('Bounding Box')
            value = spatial().substring(spatial().indexOf(':') + 1)
            newSpatial = if @previousSpatial == '' || @previousSpatial == @swPoint() + ":" + @nePoint() then value else @swPoint() + ":" + @nePoint()
        else # spatial type switched
          if type == 'point'
            @spatialType('Point')
            value = spatial().split(':')[1]
            newSpatial = value
          else if type == 'bounding_box'
            @spatialType('Bounding Box')
            value = spatial().substring(spatial().indexOf(':') + 1)
            newSpatial = value

        if newSpatial?.length > 0
          value = newSpatial
          newSpatial = "#{type}:#{value}"
          if type == 'point'
            @coordinates(value)
          else
            @swPoint(value.split(':')[0])
            @nePoint(value.split(':')[1])
            @coordinates(@swPoint() + ":" + @nePoint())
          @previousSpatial = value
          @previousType = type
          spatial(newSpatial)
        else
          null

  exports = SpatialCondition
