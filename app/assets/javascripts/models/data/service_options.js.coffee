ns = @edsc.models.data

ns.ServiceOptions = do (ko, edsc = @edsc, KnockoutModel = @edsc.models.KnockoutModel, extend = $.extend) ->

  class SubsetOptions
    constructor: (@config) ->
      @parameters = for parameter in @config.parameters
        extend({selected: ko.observable(true)}, parameter)

      @formats = @config.formats

      @formatName = ko.observable(@formats[0].name)
      @format = ko.computed =>
        name = @formatName()
        for format in @formats
          return format if format.name == name
        null

      @subsetToSpatial = ko.observable(true)

    serialize: ->
      result = {format: @formatName()}
      if @format()?.canSubset
        result.spatial = @config.spatial if @subsetToSpatial()
        result.parameters = (p.id for p in @parameters when p.selected())
      result

    fromJson: (jsonObj) ->
      this

  class ServiceOptions
    constructor: (method, @availableMethods) ->
      @method = ko.observable(method)
      @isValid = ko.observable(true)
      @loadForm = ko.observable(false)
      @loadingForm = ko.computed (item, e) =>
        if @loadForm()
          timer = setTimeout((=>
            if document.getElementsByClassName('access-form')[0].children.length > 0
              @loadForm(false)
              clearTimeout timer
            else
              @loadForm(true)
          ), 0)
          @loadForm()
        false

      @subsetOptions = ko.observable(null)
      @prepopulatedFields = ko.computed(@_computePrepopulatedFields, this, deferEvaluation: true)

      @options = ko.computed =>
        m = @method()
        result = null
        if @availableMethods
          for available in @availableMethods when available.name == m
            result = available
            break
        if result?.subset
          @subsetOptions(new SubsetOptions(result))
        else
          @subsetOptions(null)
        result

    showSpinner: (item, e)=>
      clickedMethod = null
      for m in @availableMethods when m.name == item.name
        clickedMethod = m
        break
      echoformContainer = $('#' + $('#' + e.target.id).attr('form'))
      echoformContainer.empty?() if echoformContainer?
      if clickedMethod.type == 'service' || clickedMethod.type == 'order'
        @loadForm(true) if clickedMethod.type == 'service'
        setTimeout (=>
          ko.applyBindingsToNode(echoformContainer, {echoform: this})
          @loadForm(false)), 0
      else
        ko.cleanNode(echoformContainer);
        @loadForm(false)
      true

    _computePrepopulatedFields: ->
      result = {}
      mbr = edsc.page.query?.mbr()
      if mbr
        [result.BBOX_SOUTH, result.BBOX_WEST, result.BBOX_NORTH, result.BBOX_EAST] = mbr
      result

    serialize: ->
      method = @method()
      result = {method: method, model: @model, rawModel: @rawModel}
      for available in @availableMethods
        if available.name == method
          result.type = available.type
          result.id = available.id
          break
      result.subset = @subsetOptions()?.serialize()
      result

    fromJson: (jsonObj, index=0) ->
      @method(jsonObj.method)
      @model = jsonObj.model
      @modelInitialValue = jsonObj.model
      @rawModel = jsonObj.rawModel
      @rawModelInitialValue = jsonObj.rawModel
      @hasBeenReset = false

      @type = jsonObj.type

      if jsonObj.type == 'service' || jsonObj.type == 'order'
        echoformContainer = null
        checkExistsTimer = setInterval (=>
          echoformContainers = document.getElementsByClassName('access-form')
          if echoformContainers?.length > 0
            clearTimeout checkExistsTimer
            setTimeout (=>
              accessMethodMatched = false
              for echoformContainer in echoformContainers
                matches = echoformContainer.id.match(/access-form-(.*)-(\d+)/)
                if !accessMethodMatched && matches[1] == jsonObj.collection_id && parseInt(matches[2], 10) == index
                  accessMethodMatched = true
                  @loadForm(true) if jsonObj.type == 'service'
                  ko.applyBindingsToNode(echoformContainer, {echoform: this})
                @loadForm(false)
            ), 0
        ), 0

      @orderId = jsonObj.order_id
      @orderStatus = jsonObj.order_status
      @errorCode = jsonObj.error_code
      @errorMessage = jsonObj.error_message
      @droppedGranules = jsonObj.dropped_granules
      @subsetOptions()?.fromJson(jsonObj.subset) if jsonObj.subset
      @serviceOptions = jsonObj.service_options
      this

  class ServiceOptionsModel extends KnockoutModel
    constructor: (@granuleAccessOptions) ->
      @accessMethod = ko.observableArray()
      @isLoaded = @computed
        read: =>
          opts = @granuleAccessOptions()
          @_methods = methods = opts.methods
          result = methods?
          @_onAccessOptionsLoad(opts) if result
          result
        deferEvaluation: true
      @canAddAccessMethod = ko.observable(false)
      @readyToDownload = @computed(@_computeIsReadyToDownload, this, deferEvaluation: true)

    _onAccessOptionsLoad: (options) ->
      availableMethods = options.methods
      methods = @accessMethod.peek()
      for method in methods
        method.availableMethods = availableMethods
      validDefaults = []
      defaultMethods = options.defaults?.accessMethod
      if defaultMethods
        for method in defaultMethods
          for available in availableMethods
            if method.method == available.name
              method.collection_id = available.collection_id
              validDefaults.push(method)
        @fromJson(accessMethod: validDefaults)
      @addAccessMethod() if methods.length == 0 && availableMethods.length > 0 && validDefaults.length == 0
      @canAddAccessMethod(availableMethods.length > 1 ||
        (availableMethods.length == 1 && availableMethods[0].type != 'download'))

    _computeIsReadyToDownload: ->
      return false unless @isLoaded()
      return true if @granuleAccessOptions().methods?.length == 0
      
      result = false
      for m in @accessMethod()
        result = true if m.method()? && m.isValid()
        result = true if !m.loadForm()
      result

    addAccessMethod: =>
      @accessMethod.push(new ServiceOptions(null, @granuleAccessOptions().methods))

    removeAccessMethod: (method) =>
      @accessMethod.remove(method)

    serialize: ->
      {accessMethod: (m.serialize() for m in @accessMethod())}

    fromJson: (jsonObj) ->
      @accessMethod.removeAll()
      for json, i in jsonObj.accessMethod
        method = new ServiceOptions(null, @_methods)
        method.fromJson(json, i)
        @accessMethod.push(method)
      this

  exports = ServiceOptionsModel
