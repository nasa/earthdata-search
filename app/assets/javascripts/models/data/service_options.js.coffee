ns = @edsc.models.data

ns.ServiceOptions = do (ko, edsc = @edsc, KnockoutModel = @edsc.models.KnockoutModel, extend = $.extend) ->

  class SubsetOptions
    constructor: (@config) ->
      @parameters = for parameter in @config.parameters
        extend({ selected: ko.observable(true) }, parameter)

      @formats = @config.formats

      @formatName = ko.observable(@formats[0].name)
      @format = ko.computed =>
        name = @formatName()
        for format in @formats
          return format if format.name == name
        null

      @subsetToSpatial = ko.observable(true)

    serialize: ->
      result = { format: @formatName() }
      if @format()?.canSubset
        result.spatial = @config.spatial if @subsetToSpatial()
        result.parameters = (p.id for p in @parameters when p.selected())
      result

    fromJson: (jsonObj) ->
      this

  class ServiceOptions
    constructor: (method, @availableMethods) ->
      @method = ko.observable(method)
      @methodType = ko.observable('')
      @isValid = ko.observable(true)
      @loadForm = ko.observable(false)

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

      @method.subscribe =>
        if @availableMethods
          for available in @availableMethods when available.name == @method()
            @methodType(available.type)

    showSpinner: (item, e) =>
      @loadForm(true)
      clickedMethod = null
      for m in @availableMethods when m.name == item.name
        clickedMethod = m
        break

      if e.target.id
        echoformContainer = $('#' + $('#' + e.target.id).attr('form'))
        if clickedMethod.type == 'service' || clickedMethod.type == 'order'
          setTimeout (=>
            ko.applyBindingsToNode(echoformContainer, { echoform: this })
            @loadForm(false)), 0
        else
          ko.cleanNode(echoformContainer)
          @loadForm(false)
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
      result = { method: method, model: @model, rawModel: @rawModel }
      for available in @availableMethods
        if available.name == method
          result.type = available.type
          result.id = available.id

          # Don't save model and rawModel if using download
          if method.toLowerCase() == 'download'
            result.model = available.model
            result.rawModel = available.rawModel
          break
      result.subset = @subsetOptions()?.serialize()
      result

    fromJson: (jsonObj, index = 0) ->
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
          @echoformContainers = document.getElementsByClassName('access-form')
          if @echoformContainers?.length > 0
            clearTimeout checkExistsTimer
            setTimeout (=>
              accessMethodMatched = false
              for echoformContainer in @echoformContainers
                matches = echoformContainer.id.match(/access-form-(.*)-(\d+)/)
                if !accessMethodMatched && matches[1] == jsonObj.collection_id && parseInt(matches[2], 10) == index
                  accessMethodMatched = true
                  @loadForm(true) if jsonObj.type == 'service'
                  # After the binding is complete, toggle select elements to trigger validation lest they be pruned
                  $.when(ko.applyBindingsToNode(echoformContainer, echoform: this)).done ->
                    $('.echoforms-element-select').each ->
                      # Only concerning ourselves with projection selects at the moment...
                      if (this.id.indexOf("projectselect") >= 0)
                        original = $(this).val()
                        $(this).val('&').change().val(original).change()
                      return
                @loadForm(false)
            ), 0
        ), 0

      @orderId = jsonObj.order_id

      # Default the order_status to `creating` as of EDSC-2058. On page load we
      # immediately ping the endpoint to update the value
      @orderStatus = jsonObj.order_status || 'creating'
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
      # Return false if the accessMethods have not finished loading
      return false unless @isLoaded()

      # Return true if no accessMethods are present
      if @granuleAccessOptions().methods?.length == 0
        return true

      result = false
      for m in @accessMethod()
        result = true if (m.isValid() && !m.loadForm()) && m.method()?

      if result
        # The submit button defaults to having a title that informs the user
        # that they need to select an accessMethod, this clears that when a
        # valid accessMethod has been selected
        $('.access-submit').prop('title', "")

      result

    addAccessMethod: =>
      @accessMethod.push(new ServiceOptions(null, @granuleAccessOptions().methods))

    removeAccessMethod: (method) =>
      @accessMethod.remove(method)

    serialize: ->
      { accessMethod: (m.serialize() for m in @accessMethod()) }

    fromJson: (jsonObj) ->
      @accessMethod.removeAll()
      for json in jsonObj.accessMethod
        method = new ServiceOptions(null, @_methods)
        index = @_methods?.findIndex((element) -> element.name == json.method)
        method.fromJson(json, index)
        @accessMethod.push(method)
      this

  exports = ServiceOptionsModel
