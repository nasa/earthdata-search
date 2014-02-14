ns = @edsc.models.data

ns.ServiceOptions = do (ko) ->

  class ServiceOptionsModel
    constructor: (@granuleAccessOptions) ->
      @accessMethod = ko.observable(null)
      @readyToDownload = ko.computed(@_computeIsReadyToDownload, this, deferEvaluation: true)

    _computeIsReadyToDownload: ->
      # == false because the value is undefined while granuleAccessOptions loads
      @accessMethod()? || @granuleAccessOptions().canDownload == false

    serialize: ->
      {accessMethod: @accessMethod()} if @accessMethod()

    fromJson: (jsonObj) ->
      @accessMethod(jsonObj.accessMethod) if jsonObj?

  exports = ServiceOptionsModel
