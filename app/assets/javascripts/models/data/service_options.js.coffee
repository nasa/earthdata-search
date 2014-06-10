ns = @edsc.models.data

ns.ServiceOptions = do (ko, KnockoutModel = @edsc.models.KnockoutModel) ->

  class ServiceOptions
    constructor: (method, @availableMethods) ->
      @method = ko.observable(method)
      @isValid = ko.observable(true)

    serialize: ->
      method = @method()
      result = {method: method, model: @model}
      for available in @availableMethods
        if available.name == method
          result.type = available.type
          result.id = available.id
          break
      result

    fromJson: (jsonObj) ->
      @method(jsonObj.method)
      @model = jsonObj.model
      @type = jsonObj.type
      @orderId = jsonObj.order_id
      this

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

      @canAddAccessMethod = ko.observable(false)
      @readyToDownload = @computed(@_computeIsReadyToDownload, this, deferEvaluation: true)

    _onAccessOptionsLoad: (options) ->
      availableMethods = options.methods
      methods = @accessMethod.peek()
      for method in methods
        method.availableMethods = availableMethods
      @addAccessMethod() if methods.length == 0 && availableMethods.length > 0
      @canAddAccessMethod(availableMethods.length > 1 ||
        (availableMethods.length == 1 && availableMethods[0].type != 'download'))

    _computeIsReadyToDownload: ->
      return false unless @isLoaded()
      return true if @granuleAccessOptions().methods?.length == 0

      for m in @accessMethod()
        return false unless m.method()? && m.isValid()
      true

    addAccessMethod: =>
      @accessMethod.push(new ServiceOptions(null, @granuleAccessOptions().methods))

    removeAccessMethod: (method) =>
      @accessMethod.remove(method)

    serialize: ->
      {accessMethod: (m.serialize() for m in @accessMethod())}

    fromJson: (jsonObj) ->
      @accessMethod.removeAll()
      for json in jsonObj.accessMethod
        method = new ServiceOptions(null)
        method.fromJson(json)
        @accessMethod.push(method)
      this

  exports = ServiceOptionsModel
