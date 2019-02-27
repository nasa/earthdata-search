#= require models/handoff/edsc_handoff

ns = @edsc.models.handoff

ns.GiovanniHandoff = do (
    ko,
    $ = jQuery
    EdscHandoff = ns.EdscHandoff
  ) ->

  class GiovanniHandoffModel extends EdscHandoff
    getProviderRootUrl: ->
      'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp'

    getProviderName: ->
      'Giovanni'

    getProviderUrl: ->
      giovanniParams = {}

      # Temporal
      if @temporal.isSet()
        startDate = @temporal.start
        endDate   = @temporal.stop

        giovanniParams['starttime'] = startDate.queryDateString()
        giovanniParams['endtime']   = endDate.queryDateString()

      # Spatial
      if @spatial
        spatialDetails = @spatial.match('([a-z_]+)\:(.+)')

        # Bounding box
        if spatialDetails[1] == 'bounding_box'
          boundingBoxCorners = spatialDetails[2].split(':')

          southWestCorners = boundingBoxCorners[0].split(',')
          northEastorners  = boundingBoxCorners[1].split(',')

          giovanniParams['bbox'] = [southWestCorners[0], southWestCorners[1], northEastorners[0], northEastorners[1]].join(',')

      if @keywords
        giovanniParams['searchTerms'] = @keywords

      # Collection specific data
      if @collection
        giovanniParams['dataKeyword'] = @collection.short_name

      if @variables?.length
        variableAliases = []

        for variable in @variables
          variableAliases.push([@collection.short_name(), @collection.version_id, variable.umm()?.Name].join('_'))

        giovanniParams['data'] = variableAliases.join(',')

      # Return the constructed URL
      [@getProviderRootUrl(), $.param(giovanniParams)].join('&')

  exports = GiovanniHandoffModel
