#= require models/data/granules
#= require models/data/service_options

ns = @edsc.models.data

ns.Collection = do (ko
                 DetailsModel = @edsc.models.DetailsModel
                 scalerUrl = @edsc.config.browseScalerUrl
                 Granules=ns.Granules
                 GranuleQuery = ns.query.GranuleQuery
                 ServiceOptionsModel = ns.ServiceOptions
                 toParam=jQuery.param
                 extend=jQuery.extend
                 ajax = @edsc.util.xhr.ajax
                 dateUtil = @edsc.util.date
                 ) ->

  collections = ko.observableArray()

  randomKey = Math.random()

  register = (collection) ->
    collection.reference()
    collections.push(collection)
    collection

  class Collection extends DetailsModel
    @findOrCreate: (jsonData, query) ->
      id = jsonData.id
      featured = jsonData.featured
      for collection in collections()
        if collection.id == id
          if (jsonData.short_name? && !collection.hasAtomData()) || collection.featured != featured || jsonData.granule_count != collection.granule_count
            collection.fromJson(jsonData)
          return collection.reference()
      register(new Collection(jsonData, query, randomKey))

    @visible: ko.computed
      read: -> collection for collection in collections() when collection.visible()

    constructor: (jsonData, @query, inKey) ->
      throw "Collections should not be constructed directly" unless inKey == randomKey
      @granuleCount = ko.observable(0)

      @hasAtomData = ko.observable(false)

      @granuleQueryLoaded = ko.observable(false)
      Object.defineProperty this, 'granuleQuery',
        get: ->
          @granuleQueryLoaded(true)
          @_granuleQuery ?= @disposable(new GranuleQuery(@id, @query, @searchable_attributes))

      Object.defineProperty this, 'granulesModel',
        get: -> @_granulesModel ?= @disposable(new Granules(@granuleQuery, @query))

      @details = @asyncComputed({}, 100, @_computeCollectionDetails, this)
      @detailsLoaded = ko.observable(false)

      @spatial = @computed(@_computeSpatial, this, deferEvaluation: true)
      @spatial_layer_css = @computed(@_computeSpatialLayerCss, this, deferEvaluation: true)
      @timeRange = @computed(@_computeTimeRange, this, deferEvaluation: true)
      @granuleDescription = @computed(@_computeGranuleDescription, this, deferEvaluation: true)

      @visible = ko.observable(false)

      @fromJson(jsonData)

      @spatial_constraint = @computed =>
        if @points?
          'point:' + @points[0].split(/\s+/).reverse().join(',')
        else
          null

      @echoGranulesUrl = @computed
        read: =>
          paramStr = toParam(@granuleQuery.params())
          "#{@details().granule_url}?#{paramStr}"
        deferEvaluation: true

    _computeTimeRange: ->
      if @hasAtomData()
        result = dateUtil.timeSpanToIsoDate(@time_start, @time_end)
      (result || "Unknown")

    _computeSpatial: ->
      (@_spatialString("Bounding Rectangles", @boxes) ?
       @_spatialString("Points", @points) ?
       @_spatialString("Polygons", @polygons) ?
       @_spatialString("Lines", @lines))

    _spatialString: (title, spatial) ->
      if spatial
        suffix = if spatial.length > 1 then " ..." else ""
        "#{title}: #{spatial[0]}#{suffix}"
      else
        null

    _computeSpatialLayerCss: ->
      parent_styles = getComputedStyle(document.getElementById(@id + "-map"))
      parent_width = parseInt(parent_styles.width)
      parent_height = parseInt(parent_styles.height)
      # Pick the first spatial element and draw on the mini map.
      # For complex polygons, the layer is estimated and is just for illustration.
      if @boxes?
        first_elem = @boxes[0].split(' ')
        top = (90 - Math.max(first_elem[0], first_elem[2])) / 180 * parent_height
        left = (Math.min(first_elem[1], first_elem[3]) + 180) / 360 * parent_width
        width = ((Math.max(first_elem[1], first_elem[3]) + 180) - (Math.min(first_elem[1], first_elem[3]) + 180)) / 360 * parent_width
        height = ((Math.max(first_elem[0], first_elem[2]) + 90) - (Math.min(first_elem[0], first_elem[2]) + 90)) / 180 * parent_height
      else if @points?
        first_elem = []
        first_elem.push parseInt(p) for p in @points[0].split(' ')
        if first_elem[0] >= 0 then top = (90 - first_elem[0]) / 180 * parent_height else top = (90 + first_elem[0]) / 180 * parent_height
        left = (180 + first_elem[1]) / 360 * parent_width
        width = height = 10
      else if @polygons?
        first_elem = @polygons[0][0].split(' ')
        lats = []
        lats.push parseInt(first_elem[i]) for i in [0..first_elem.length - 1] when i % 2 == 0
        lngs = []
        lngs.push parseInt(first_elem[i]) for i in [0..first_elem.length - 1] when i % 2 == 1
        top = (90 - (Math.max.apply @, lats)) / 180 * parent_height
        left = ((Math.min.apply @, lngs) + 180) / 360 * parent_width
        height = (((Math.max.apply @, lats) + 180) - ((Math.min.apply @, lats) + 180)) / 360 * parent_width
        width = (((Math.max.apply @, lngs) + 90) - ((Math.min.apply @, lngs) + 90)) / 180 * parent_height
      else
        top = left = 0
        width = parent_width
        height = parent_height
      "top: " + top + "px; left: " + left + "px; width: " + width + "px; height: " + height + "px;"

    _computeGranuleDescription: ->
      result = null
      return result unless @hasAtomData()
      if @has_granules
        if @granulesModel.isLoaded()
          hits = @granulesModel.hits()
        else
          hits = @granuleCount()
        if hits?
          result = "#{hits} Granule"
          result += 's' if hits != 1
      else
        result = 'Collection only'
      result

    thumbnail: ->
      granule = @browseable_granule
      collection_id = @id for link in @links when link['rel'].indexOf('browse#') > -1
      if collection_id?
        "#{scalerUrl}/datasets/#{collection_id}?h=85&w=85"
      else if granule?
        "#{scalerUrl}/granules/#{granule}?h=85&w=85"
      else
        null

    granuleFiltersApplied: ->
      # granuleQuery.params() will have echo_collection_id and page_size by default
      params = @granuleQuery.serialize()
      return true for own key, value of params
      return false

    hasGranuleConfig: ->
      @granuleQueryLoaded() && Object.keys(@granuleQuery.serialize()).length > 0

    shouldDispose: ->
      result = !@hasGranuleConfig()
      collections.remove(this) if result
      result

    makeRecent: ->
      id = @id
      if id? && !@featured
        ajax
          dataType: 'json'
          url: "/collections/#{id}/use.json"
          method: 'post'
          success: (data) ->
            @featured = data

    fromJson: (jsonObj) ->
      @json = jsonObj

      attributes = jsonObj.searchable_attributes
      if attributes && @granuleQueryLoaded()
        @granuleQuery.attributes.definitions(attributes)

      @hasAtomData(jsonObj.short_name?)
      @_setObservable('gibs', jsonObj)
      @_setObservable('opendap', jsonObj)
      @_setObservable('modaps', jsonObj)
      @nrt = jsonObj.collection_data_type == "NEAR_REAL_TIME"
      @granuleCount(jsonObj.granule_count)

      for own key, value of jsonObj
        this[key] = value unless ko.isObservable(this[key])

    _setObservable: (prop, jsonObj) =>
      this[prop] ?= ko.observable(undefined)
      this[prop](jsonObj[prop] ? this[prop]())

  exports = Collection
