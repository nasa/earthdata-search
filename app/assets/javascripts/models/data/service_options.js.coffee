ns = @edsc.models.data

ns.ServiceOptions = do (ko, KnockoutModel = @edsc.models.KnockoutModel) ->

  class ServiceOptions
    constructor: (method) ->
      @method = ko.observable(method)

  class ServiceOptionsModel extends KnockoutModel
    constructor: (@granuleAccessOptions) ->
      @accessMethod = ko.observableArray()
      @accessMethod.push(new ServiceOptions(null))
      @readyToDownload = @computed(@_computeIsReadyToDownload, this, deferEvaluation: true)

    _computeIsReadyToDownload: ->
      method = true
      for m in @accessMethod()
        method = false unless m.method()?
      # == false because the value is undefined while granuleAccessOptions loads
      method || @granuleAccessOptions().canDownload == false

    addAccessMethod: =>
      @accessMethod.push(new ServiceOptions(null))

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
