#= require models/data/grid
#= require models/data/granule_attributes
#= require models/ui/temporal

ns = @edsc.models.data

ns.query = do (ko,
               param = $.param
               GridCondition=@edsc.models.data.GridCondition
               GranuleAttributes=@edsc.models.data.GranuleAttributes
               KnockoutModel=@edsc.models.KnockoutModel
               Temporal=@edsc.models.ui.Temporal
               deparam=@edsc.util.deparam
               mbr=@edsc.map.mbr
               urlUtil=@edsc.util.url
               extend=$.extend) ->

  # This is a little gross, but we're allowing an override of temporal
  # query values on the configure page only to disambiguate the user's
  # intent when they set a temporal constraint and a timeline focus.
  # We need to do it here to avoid inordinate pauses waiting for URL
  # updates, project saving, etc, when clicking the "download all button."
  if window.location.href.indexOf('/data/configure') != -1
    href = window.location.href
    overrideTemporalParam = href.match(/[?&]ot=([^&$]+)/)
    if overrideTemporalParam?
      overrideTemporal = decodeURIComponent(overrideTemporalParam[1])

  ko.extenders.queryable = (target, paramObj) ->
    paramObj.value = target
    target.params = ko.computed(null, paramObj, paramObj)
    target

  class QueryParam
    constructor: (name) ->
      name = ko.observable(name) unless ko.isObservable(name)
      @name = name

    names: ->
      @name.validValues ? [@name()]

    canWrite: ->
      value = @value()
      value = value.trim() if typeof value == "string"
      value? && (!value.length? || value.length > 0)

    canReadFrom: (query) ->
      for name in @names()
        if query[name]?
          return true
      false

    writeTo: (query) ->
      query[@name()] = @value()

    readFrom: (query) ->
      for name in @names()
        value = query[name]
        if value?
          @name(name)
          @value(value)
          break
      null

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

    canReadFrom: (query) ->
      super(query) || query.placename?

    readFrom: (query) ->
      @value([query[@name()], query.placename].join(''))

    canWrite: ->
      super() && @value() != @placename()

    writeTo: (query) ->
      placename = @placename()
      value = @value()
      if placename? && placename.length > 0 && value? && value.indexOf(placename) != -1
        value = value.replace(placename, '')
      query[@name()] = value

  class FacetParam extends QueryParam
    names: ->
      ['features', 'campaign_h', 'data_center_h', 'project_h', 'platform_h', 'instrument_h', 'science_keywords_h', 'processing_level_id_h']

    writeTo: (query) ->
      facetParams = {}
      for facet in @value()
        name = facet.param
        if name.indexOf('science_keywords_h') > -1
          facetParams[name] = facet.title
        else
          facetParams[name] ?= []
          facetParams[name].push facet.title
      queryStr = param(facetParams)
      extend(true, query, deparam(queryStr))

    canReadFrom: (query) ->
      true

    readFrom: (query) ->
      values = {}
      values[name] = query[name] for name in @names() when query[name]?
      result = []
      querystr = param(values)
      if querystr.length > 0
        facets = querystr.split('&')
        for facet in facets
          [k, v] = facet.split('=')
          result.push(param: decodeURIComponent(k), title: decodeURIComponent(v.replace(/\+/g, ' ')))
      @value(result)

  class BooleanParam extends QueryParam
    canWrite: ->
      @value() is true || @value() is 'true'

  class NegatedBooleanParam extends QueryParam
    canWrite: ->
      @value() is false || @value() is 'false' || @value() is 'gov.nasa.eosdis'
    
    readFrom: (query) ->
      for name in @names()
        value = query[name]
        if value?
          @name(name)
          @value(false)
          break
      null

    canReadFrom: (query) ->
      for name in @names()
        if query[name]?
          return if name == 'tag_key' then 'gov.nasa.eosdis' else true
      true

    writeTo: (query) ->
      query[@name()] = if @name() == 'tag_key' then 'gov.nasa.eosdis' else true

  class DelimitedParam extends QueryParam
    constructor: (name, @delimiter="\n") ->
      super(name)

    readFrom: (query) ->
      for name in @names()
        value = query[name]
        if value?
          @name(name)
          @value(value.join(@delimiter))
          break
      null

    writeTo: (query) ->
      query[@name()] = @value().split(@delimiter)

  class ExclusionParam extends QueryParam
    constructor: (name, @_type) ->
      super(name)

    writeTo: (query) ->
      query[@name()] ||= {}
      query[@name()][@_type] = @value()

    canReadFrom: (query) ->
      query[@name()]?[@_type]?

    readFrom: (query) ->
      @value(query[@name()][@_type])

    write: (query) ->
      if @canReadFrom(query)
        @readFrom(query)
      else
        @value([])

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
          params.min = min if min? && min != ''
          params.max = max if max? && max != ''
          params
        write: (value) =>
          @min(value?.min)
          @max(value?.max)
        deferEvaluation: true

  class Query extends KnockoutModel
    constructor: (@parentQuery) ->
      @params = @computed(read: @_computeParams, write: @_readParams, deferEvaluation: true)
      @ownParams = @computed(read: @_computeOwnParams, deferEvaluation: true)
      @globalParams = @computed(read: @_computeGlobalParams, deferEvaluation: true)

    queryComponent: (obj, observable=null, options={}) ->
      @_all ?= []
      @_components ?= []
      @_propagated ?= []
      @_serialized ?= []
      unless ko.isObservable(observable)
        obj.defaultValue = observable
        observable = ko.observable(observable)
      observable = observable.extend(queryable: obj)
      @_all.push(observable)
      @_components.push(observable) unless options.query is false
      @_propagated.push(observable) if options.propagate
      @_serialized.push(observable) unless options.ephemeral
      observable

    _readComponents: (components, query) ->
      for component in components
        component.params(query)

    fromJson: (query) => @_readComponents(@_serialized, query)
    clearFilters: (query) => @_readComponents(@_all, @_persistentQuery())
    _readParams: (query) => @_readComponents(@_components, query)

    _persistentQuery: -> {}

    _writeComponents: (components, inheritedParams) ->
      inheritedParams ?= @parentQuery?.globalParams() ? {}
      params = extend({}, inheritedParams)
      for component in components
        extend(true, params, component.params())

      # Perform the temporal override if appropriate
      params.temporal = overrideTemporal if overrideTemporal
      params

    serialize: -> @_writeComponents(@_serialized, {})
    _computeParams: => @_writeComponents(@_components)
    _computeGlobalParams: => @_writeComponents(@_propagated)
    _computeOwnParams: => @_writeComponents(@_components, {})

  class CollectionQuery extends Query
    constructor: (parentQuery) ->
      @focusedTemporal = ko.observable(null)
      @focusedInterval = ko.observable(null)
      @grid = new GridCondition()
      @temporal = new Temporal()

      @testFacets = @queryComponent(new QueryParam('test_facets'), '')
      @portal = @queryComponent(new QueryParam('portal'), '')
      @placename = @queryComponent(new QueryParam('placename'), '', query: false)
      @temporalComponent = @queryComponent(new QueryParam('temporal'), @temporal.applied.queryCondition, propagate: true)
      @spatial = @queryComponent(new SpatialParam(), '', propagate: true)
      @mbr = @computed(read: @_computeMbr, owner: this, deferEvaluation: true)
      @gridComponent = @queryComponent(new QueryParam('two_d_coordinate_system'), @grid.queryCondition, propagate: true)
      @facets = @queryComponent(new FacetParam(), ko.observableArray())
      @scienceKeywordFacets = @computed(read: @_computeScienceKeywordFacets, deferEvaluation: true)
      @pageSize = @queryComponent(new QueryParam('page_size'), 20, ephemeral: true)
      @keywords = @queryComponent(new KeywordParam('free_text', @placename), '')
      @originalKeywords = @queryComponent(new KeywordParam('original_keyword', @placename), '')

      @hasGranules = @queryComponent(new NegatedBooleanParam('all_collections'), true)
      @hasNonEOSDIS = @queryComponent(new NegatedBooleanParam('tag_key'), true)
      
      super(parentQuery)

    clearFilters: =>
      document.getElementById('keywords')?.value = ''
      @focusedTemporal(null)
      @focusedInterval(null)
      @placename("")
      testFacets = @testFacets()
      result = super()
      @testFacets(testFacets)
      result

    _persistentQuery: ->
      result = super()
      portal = @portal()
      result.portal = portal if portal && portal.length > 0
      result

    _computeScienceKeywordFacets: =>
      facet for facet in @facets() when facet.param.indexOf('sci') == 0

    _computeMbr: ->
      spatial = @spatial()
      result = null
      if spatial
        [type, shapePoints...] = spatial.split(':')
        shape = for pointStr in shapePoints
          latlng = pointStr.split(',').reverse()
          {lat: +latlng[0], lng: +latlng[1]}
        result = mbr.mbr(type, shape)
      result


  class GranuleQuery extends Query
    constructor: (collectionId, parentQuery, attributes) ->
      @dayNightFlagOptions = [{name: "Anytime", value: null},
                              {name: "Day only", value: "DAY"},
                              {name: "Night only", value: "NIGHT"},
                              {name: "Both day and night", value: "BOTH"}]
      @sortOptions = [{name: "Start Date, Newest first", value: ["-start_date"]},
                      {name: "Start Date, Oldest first", value: ["start_date"]},
                      {name: "End Date, Newest first", value: ["-end_date"]},
                      {name: "End Date, Oldest first", value: ["end_date"]}]
      @isValid = @computed(read: @_computeIsValid, deferEvaluation: true)
      @attributes = new GranuleAttributes(attributes)

      @temporal = new Temporal()
      @cloudCover = new Range()

      @queryComponent(new QueryParam('echo_collection_id'), collectionId, ephemeral: true)
      @temporalComponent = @queryComponent(new QueryParam('temporal'), @temporal.applied.queryCondition)
      @sortKey = @queryComponent(new QueryParam('sort_key'), ['-start_date'], ephemeral: true)

      @dayNightFlag = @queryComponent(new QueryParam('day_night_flag'), null)
      @browseOnly = @queryComponent(new BooleanParam('browse_only'), false)
      @onlineOnly = @queryComponent(new BooleanParam('online_only'), false)
      @cloudCoverComponent = @queryComponent(new QueryParam('cloud_cover'), @cloudCover.params)
      @granuleIds = @queryComponent(new DelimitedParam('readable_granule_name', ', '), '')
      @excludedGranules = @queryComponent(new ExclusionParam('exclude', 'echo_granule_id'), ko.observableArray())
      @attributeFilters = @queryComponent(new QueryParam('attribute'), @attributes.queryCondition)

      @pageSize = @queryComponent(new QueryParam('page_size'), 20, ephemeral: true)

      @singleGranuleId = ko.observable(null)

      @project = @queryComponent(new QueryParam('project'), @_computeProject(parentQuery.facets()))

      super(parentQuery)

    _computeIsValid: =>
      (@attributes.isValid() &&
       @validateCloudCoverValue(@cloudCover.min()) &&
       @validateCloudCoverValue(@cloudCover.max()) &&
       @validateCloudCoverRange(@cloudCover.min(), @cloudCover.max()))

    validateCloudCoverValue: (cloud_cover_value) =>
      value = parseFloat(cloud_cover_value)
      isNaN(value) || (value >= 0.0 && value <= 100.0)

    validateCloudCoverRange: (min, max) =>
      isNaN(parseFloat(min)) || isNaN(parseFloat(max)) || parseFloat(min) <= parseFloat(max)

    _computeProject: (facets) =>
      project = ''
      for facet in facets
        return facet.title if facet.param == 'project_h[]'
      project

  exports =
    CollectionQuery: CollectionQuery
    GranuleQuery: GranuleQuery
    ExclusionParam: ExclusionParam
