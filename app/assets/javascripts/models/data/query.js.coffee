ns = @edsc.models.data

# FIXME: Get rid of dependency on page model
ns.Query = do (ko,
               KnockoutModel=@edsc.models.KnockoutModel
               evilPageModels=@edsc.models.page
               extend=$.extend) ->

  class Query extends KnockoutModel
    constructor: (@_extraParams={}) ->
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
      @cloud_cover_min = ko.observable("")
      @cloud_cover_max = ko.observable("")
      @browse_only = ko.observable(false)
      @online_only = ko.observable(false)
      @granule_ids = ko.observable("")
      @granuleIdsSelectedOptionValue = ko.observable("granule_ur")

      @validQuery = ko.observable(true)

      @params = @computed(@_computeParams)

    fromJson: (jsonObj) ->
      @keywords(jsonObj.keywords)
      @spatial(jsonObj.spatial)
      if jsonObj.temporal?
        @temporal().fromJson(jsonObj.temporal)
      @facets(jsonObj.facets ? [])
      @placename(jsonObj.placename)
      @day_night_flag(jsonObj.day_night_flag)
      @cloud_cover_min(jsonObj.cloud_cover_min)
      @cloud_cover_max(jsonObj.cloud_cover_max)
      @browse_only(jsonObj.browse_only)
      @online_only(jsonObj.online_only)
      @granule_ids(jsonObj.granule_ids)

    serialize: ->
      {
        keywords: @keywords()
        spatial: @spatial()
        temporal: @temporal()?.serialize()
        facets: @facets()
        placename: @placename()
        day_night_flag: @day_night_flag()
        cloud_cover_min: @cloud_cover_min()
        cloud_cover_max: @cloud_cover_max()
        browse_only: @browse_only()
        online_only: @online_only()
        granule_ids: @granule_ids()
      }

    clearFilters: =>
      @keywords('')
      @spatial('')
      evilPageModels.current.ui.spatialType.selectNone()
      @temporal().clear()
      @placename('')
      @facets.removeAll()
      @day_night_flag("")
      @cloud_cover_min("")
      @cloud_cover_max("")
      @browse_only(false)
      @online_only(false)
      @granule_ids("")

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
      params = extend({}, @_extraParams)

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

      cloud_cover_min = @cloud_cover_min()
      cloud_cover_max = @cloud_cover_max()
      if cloud_cover_min?.length > 0 || cloud_cover_max?.length > 0
        params.cloud_cover ||= {}
        params.cloud_cover["min"] = cloud_cover_min
        params.cloud_cover["max"] = cloud_cover_max
      browse_only = @browse_only()
      params.browse_only = true if browse_only

      online_only = @online_only()
      params.online_only = true if online_only

      granule_ids = @granule_ids()
      if granule_ids?.length > 0
        for id in granule_ids.split("\n")
          param = @granuleIdsSelectedOptionValue()
          params[param] ||= []
          params[param].push(id)

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

    validateCloudCoverValue: (cloud_cover_value) =>
      value = parseFloat(cloud_cover_value)
      valid = false
      if isNaN(value)
        valid = true
      else if value >= 0.0 && value <= 100.0
        valid = true
      valid

    validateCloudCoverRange: (min, max) =>
      valid_range = ((isNaN(parseFloat(min)) || isNaN(parseFloat(max))) || parseFloat(min) <= parseFloat(max))
      valid_min = @validateCloudCoverValue(min)
      valid_max = @validateCloudCoverValue(max)
      valid = valid_range && valid_min && valid_max
      @validQuery(valid)
      valid_range

  exports = Query
