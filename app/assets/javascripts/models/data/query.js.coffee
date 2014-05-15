#= require models/data/grid
#= require models/ui/temporal

ns = @edsc.models.data

# FIXME: Get rid of dependency on page model
ns.query = do (ko,
               GridCondition=@edsc.models.data.GridCondition
               KnockoutModel=@edsc.models.KnockoutModel
               Temporal=@edsc.models.ui.Temporal
               extend=$.extend) ->

  ko.extenders.queryable = (target, paramObj) ->
    paramObj.value = target
    target.params = ko.computed(null, paramObj, paramObj)
    target

  class QueryParam
    constructor: (name) ->
      name = ko.observable(name) unless ko.isObservable(name)
      @name = name

    canWrite: ->
      value = @value()
      value = value.trim() if typeof value == "string"
      value? && (!value.length? || value.length > 0)

    canReadFrom: (query) ->
      query[@name()]?

    writeTo: (query) ->
      query[@name()] = @value()

    readFrom: (query) ->
      @value(query[@name()])

    read: ->
      query = null
      if @canWrite()
        query = {}
        @writeTo(query)
      query

    write: (query) ->
      if @canReadFrom(query)
        @readFrom(query)
      else
        @value(@defaultValue ? null)

  class SpatialParam extends QueryParam
    writeTo: (query) ->
      spatial = @value().split(':')
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

      query[type] = spatial.join(',')

    canReadFrom: (query) ->
      query.point? || query.bounding_box? || query.line? || query.polygon?

    readFrom: (query) ->
      types = (t for t in ['point', 'bounding_box', 'line', 'polygon'] when query[t]?)
      type = types[0]
      value = query[type]
      # Replace every second comma with a colon
      value = value.replace(/([^,]*,[^,]*)(,|$)/g, '$1:')
      value = value.slice(0, -1)

      # Remove the last point in polygons
      value = value.replace(/:[^:]*$/, '') if type == 'polygon'
      @value("#{type}:#{value}")

  class KeywordParam extends QueryParam
    constructor: (name, @placename) ->
      super(name)

    canWrite: ->
      super() && @value() != @placename()

    writeTo: (query) ->
      placename = @placename()
      value = @value()
      if placename? && placename.length > 0 && value? && value.indexOf(placename) != -1
        value = value.replace(placename, '')
      query[@name()] = value

  class FacetParam extends QueryParam
    writeTo: (query) ->
      for facet in @value()
        param = facet.param
        query[param] ?= []
        query[param].push(facet.term)
      query

    canReadFrom: (query) ->
      true

    readFrom: (query) ->
      @value([])

  class BooleanParam extends QueryParam
    canWrite: ->
      @value() is true || @value() is 'true'

  class DelimitedParam extends QueryParam
    constructor: (name, @delimiter="\n") ->
      super(name)

    readFrom: (query) ->
      @value(query[@name()].join(@delimiter))

    writeTo: (query) ->
      query[@name()] = @value().split(@delimiter)

  class Range
    constructor: ->
      @min = ko.observable()
      @max = ko.observable()
      @params = ko.computed
        read: =>
          min = @min()
          max = @max()
          return null unless min? || max?
          params = {}
          params.min = min if min?
          params.max = max if max?
          params
        write: (value) =>
          @min(value?.min)
          @max(value?.max)
        deferEvaluation: true

  class Query extends KnockoutModel
    constructor: (@parentQuery) ->
      @params = @computed(read: @serialize, write: @fromJson, deferEvaluation: true)
      @globalParams = @computed(read: @_computeGlobalParams, deferEvaluation: true)

    queryComponent: (obj, observable=null, propagate=false) ->
      @_components ?= []
      @_propagated ?= []
      unless ko.isObservable(observable)
        obj.defaultValue = observable
        observable = ko.observable(observable)
      observable = observable.extend(queryable: obj)
      @_components.push(observable)
      @_propagated.push(observable) if propagate
      observable

    fromJson: (query) =>
      for component in @_components
        component.params(query)

    serialize: => @_writeComponents(@_components)

    clearFilters: =>
      for component in @_components
        component.params({})

    _writeComponents: (components) ->
      params = {}
      params = extend(params, @parentQuery.globalParams()) if @parentQuery
      for component in components
        extend(true, params, component.params())
      params

    _computeGlobalParams: => @_writeComponents(@_propagated)
    _computeParams: =>

  class DatasetQuery extends Query
    constructor: (parentQuery) ->
      super(parentQuery)
      @focusedTemporal = ko.observable(null)
      @focusedInterval = ko.observable(null)
      @placename = ko.observable("")
      @grid = new GridCondition()
      @temporal = new Temporal()

      @temporalComponent = @queryComponent(new QueryParam('temporal'), @temporal.applied.queryCondition, true)
      @spatial = @queryComponent(new SpatialParam(), '', true)
      @gridComponent = @queryComponent(new QueryParam('two_d_coordinate_system'), @grid.queryCondition, true)
      @facets = @queryComponent(new FacetParam(), ko.observableArray())
      @pageSize = @queryComponent(new QueryParam('page_size'), 20)
      @keywords = @queryComponent(new KeywordParam('free_text', @placename), '')

    clearFilters: =>
      @focusedTemporal(null)
      @focusedInterval(null)
      @placename("")
      super()

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

  class DataQualitySummaryQuery extends Query
    constructor: (datasetId, parentQuery) ->
      super(parentQuery)
      @queryComponent(new QueryParam('catalog_item_id'), datasetId)

  class GranuleQuery extends Query
    constructor: (datasetId, parentQuery) ->
      super(parentQuery)
      @granuleIdsSelectedOptionValue = ko.observable("granule_ur")
      @dayNightFlagOptions = [{name: "Anytime", value: null},
                              {name: "Day only", value: "DAY"},
                              {name: "Night only", value: "NIGHT"},
                              {name: "Both day and night", value: "BOTH"}]
      @isValid = @computed(read: @_computeIsValid, deferEvaluation: true)

      @temporal = new Temporal()
      @cloudCover = new Range()

      @queryComponent(new QueryParam('echo_collection_id'), datasetId)
      @temporalComponent = @queryComponent(new QueryParam('temporal'), @temporal.applied.queryCondition)
      @sortKey = @queryComponent(new QueryParam('sort_key'), ['-start_date'])

      @dayNightFlag = @queryComponent(new QueryParam('day_night_flag'), null)
      @browseOnly = @queryComponent(new BooleanParam('browse_only'), false)
      @onlineOnly = @queryComponent(new BooleanParam('online_only'), false)
      @cloudCoverComponent = @queryComponent(new QueryParam('cloud_cover'), @cloudCover.params)
      @granuleIds = @queryComponent(new DelimitedParam(@granuleIdsSelectedOptionValue), '')

      @pageSize = @queryComponent(new QueryParam('page_size'), 20)

    fromJson: (query) =>
      granule_option = 'granule_ur'
      granule_option = 'producer_granule_id' if query.producer_granule_id
      @granuleIdsSelectedOptionValue(granule_option)
      super(query)

    _computeIsValid: =>
      (@validateCloudCoverValue(@cloudCover.min()) &&
       @validateCloudCoverValue(@cloudCover.max()) &&
       @validateCloudCoverRange(@cloudCover.min(), @cloudCover.max()))

    validateCloudCoverValue: (cloud_cover_value) =>
      value = parseFloat(cloud_cover_value)
      isNaN(value) || (value >= 0.0 && value <= 100.0)

    validateCloudCoverRange: (min, max) =>
      isNaN(parseFloat(min)) || isNaN(parseFloat(max)) || parseFloat(min) <= parseFloat(max)

  exports =
    DatasetQuery: DatasetQuery
    GranuleQuery: GranuleQuery
    DataQualitySummaryQuery: DataQualitySummaryQuery
