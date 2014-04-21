ns = @edsc.models.data

ns.ServiceOptions = do (ko, KnockoutModel = @edsc.models.KnockoutModel) ->

  class ServiceOptions
    constructor: (method) ->
      @method = ko.observable(method)

  class ServiceOptionsModel extends KnockoutModel
    constructor: (@granuleAccessOptions) ->
      @accessMethod = ko.observableArray() #([ko.observable(null)]) #ko.observable(null)
      @accessMethod.push(new ServiceOptions(null))
      @readyToDownload = @computed(@_computeIsReadyToDownload, this, deferEvaluation: true)

    _computeIsReadyToDownload: ->
      method = true
      for m in @accessMethod()
        method = false unless m.method()?
      # == false because the value is undefined while granuleAccessOptions loads
      # @accessMethod()[0]? || @granuleAccessOptions().canDownload == false
      method || @granuleAccessOptions().canDownload == false

    addAccessMethod: =>
      @accessMethod.push(new ServiceOptions(null))

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
