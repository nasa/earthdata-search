ns = @edsc.models.data

ns.ServiceOptions = do (ko, KnockoutModel = @edsc.models.KnockoutModel) ->

  class ServiceOptions
    constructor: (method, @availableMethods) ->
      @method = ko.observable(method)

  class ServiceOptionsModel extends KnockoutModel
    constructor: (@granuleAccessOptions) ->
      @accessMethod = ko.observableArray()
      @isLoaded = @computed
        read: =>
          opts = @granuleAccessOptions()
          methods = opts.methods
          result = methods?
          @_onAccessOptionsLoad(opts) if result
          result
        deferEvaluation: true

      @readyToDownload = @computed(@_computeIsReadyToDownload, this, deferEvaluation: true)

    _onAccessOptionsLoad: (options) ->
      availableMethods = options.methods
      methods = @accessMethod.peek()
      for method in methods
        method.availableMethods = availableMethods
      @addAccessMethod() if methods.length == 0

    _computeIsReadyToDownload: ->
      return false unless @isLoaded()
      return true if @granuleAccessOptions().methods?.length == 0

      for m in @accessMethod()
        return false unless m.method()?
      true

    addAccessMethod: =>
      @accessMethod.push(new ServiceOptions(null, @granuleAccessOptions().methods))

    removeAccessMethod: (method) =>
      @accessMethod.remove(method)

    serialize: ->
      methods = []
      for m in @accessMethod()
        methods.push(m.method())
      {accessMethod: methods}

    fromJson: (jsonObj) ->
      @accessMethod.removeAll()
      for method in jsonObj.accessMethod
        @accessMethod.push(new ServiceOptions(method))

  exports = ServiceOptionsModel
