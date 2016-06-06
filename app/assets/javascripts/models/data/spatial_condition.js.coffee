ns = @edsc.models.data

ns.SpatialCondition = do (ko, KnockoutModel=@edsc.models.KnockoutModel) ->
  class SpatialCondition extends KnockoutModel
    constructor: (spatial)->
      @coordinates = ko.observable("")
      @spatialType = ko.observable("Spatial")
      @inputWidth = ko.observable(0)
      @previousSpatial = ''

      @error = @computed =>
#        coordinates = @coordinates()?.trim()
#        if coordinates? && coordinates.length > 0
#          coords = coordinates.split(/\s+/)
#          for coord in coords
#            ranges = coord.split(',')
#            return "Coordinate must be two comma-separated numbers: #{coord}" unless ranges.length == 2
#            for range in ranges
#              match = range.match(/^(\d+)(?:-(\d+))?$/)
#              unless match?
#                return "Invalid coordinate: #{range}"
#              [all, min, max] = match
#              min = parseInt(min, 10)
#              max = parseInt(max, 10)
        return "Range minimum is greater than its maximum:"
#        null


      @queryCoordinates = @computed =>
        console.log "++++++++++++++ queryCoordinates: read: ", @coordinates()
        type = spatial().split(':')[0]
        if type == 'point'
          @spatialType('Point')
          value = spatial().split(':')[1]
        else if type == 'bounding_box'
          @spatialType('Bounding Box')
          value = spatial().substring(spatial().indexOf(':') + 1)

        newSpatial = if @previousSpatial == @coordinates() then value else @coordinates()

        if newSpatial?.length > 0
          value = newSpatial
          newSpatial = "#{type}:#{value}"

          @coordinates(value)
          @previousSpatial = value
          spatial(newSpatial)
        else
          null

#      @hint = @computed =>
#        sel = @selected()
#        if sel?
#          "Enter #{sel.axis0.label} and #{sel.axis1.label} coordinates separated by spaces, e.g. \"2,3 5,7 8,8\""
#        else
#          "Choose a coordinate system"

    clear: ->
      @coordinates("")
      @spatialType = ko.observable("Spatial")
      @inputWidth = ko.observable(0)

  exports = SpatialCondition
