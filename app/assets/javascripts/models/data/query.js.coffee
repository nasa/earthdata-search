ns = @edsc.models.data

# FIXME: Get rid of dependency on jQuery, ui, and page model
ns.Query = do (ko, evilPageModels=@edsc.models.page) ->

  class Query
    constructor: ->
      @keywords = ko.observable("")
      @spatial = ko.observable("")

      @temporal = ko.observable(null)

      @facets = ko.observableArray()
      @placename = ko.observable("")

      @day_night_flag_options = [{name: "Anytime", value: null},
                                 {name: "Day only", value: "DAY"},
                                 {name: "Night only", value: "NIGHT"},
                                 {name: "Both day and night", value: "BOTH"}]
      @day_night_flag = ko.observable("")

      @params = ko.computed(@_computeParams)

    fromJson: (jsonObj) ->
      @keywords(jsonObj.keywords)
      @spatial(jsonObj.spatial)
      if jsonObj.temporal
        @temporal().fromJson(jsonObj.temporal)
      @facets(jsonObj.facets)
      @placename(jsonObj.placename)
      @day_night_flag(jsonObj.day_night_flag)

    serialize: ->
      {
        keywords: @keywords()
        spatial: @spatial()
        temporal: @temporal()?.serialize()
        facets: @facets()
        placename: @placename()
        day_night_flag: @day_night_flag()
      }

    clearFilters: =>
      @keywords('')
      @spatial('')
      evilPageModels.current.ui.spatialType.selectNone()
      @temporal().clear()
      @placename('')
      @facets.removeAll()
      @day_night_flag("")

    toggleQueryDatasetSpatial: (dataset) =>
      constraint = dataset.spatial_constraint()
      spatial = @spatial()
      constraint = "" if constraint == spatial
      @spatial(constraint)
      false

    canQueryDatasetSpatial: (dataset) =>
      spatial = @spatial()
      constraint = dataset.spatial_constraint()
      constraint? && (!spatial || spatial == constraint)

    _computeParams: =>
      params = {}

      keywords = @keywords()?.trim()
      if keywords?.length > 0
        placename = @placename()
        if placename? && placename.length > 0 && keywords.indexOf(placename) == 0
          keywords = keywords.replace(placename, '')
        params.free_text = keywords

      spatial = @spatial()
      @_computeSpatialParams(params, spatial) if spatial?.length > 0

      temporal = @temporal()?.queryCondition()
      params.temporal = temporal if temporal?.length > 0

      for facet in @facets()
        param = facet.param
        params[param] ||= []
        params[param].push(facet.term)

      params.placename = placename if placename?.length > 0

      # For testing GIBS visualizations
      #params.echo_collection_id = ['C14758250-LPDAAC_ECS', 'C1000000016-LANCEMODIS', 'C1000000019-LANCEMODIS']

      day_night_flag = @day_night_flag()
      params.day_night_flag = day_night_flag if day_night_flag?.length > 0

      params.page_size = 20

      params

    _computeSpatialParams: (params, spatialStr) ->
      spatial = spatialStr.split(':')
      type = spatial.shift()

      if type != 'point' && type != 'bounding_box'  && type != 'line'
        type = 'polygon'

      spatial = for coord in spatial
        [lon, lat] = coord.split(',')
        lon = parseFloat(lon)
        lon += 360 while lon < -180
        lon -= 360 while lon > 180
        lat = parseFloat(lat)
        lat = Math.min(90, lat)
        lat = Math.max(-90, lat)
        "#{lon},#{lat}"

      if type == 'polygon'
        spatial.push(spatial[0])

      params[type] = spatial.join(',')

  exports = Query