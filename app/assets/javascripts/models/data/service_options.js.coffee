ns = @edsc.models.data

ns.ServiceOptions = do (ko) ->
  class ServiceOptionsModel
    constructor: (@dataset) ->
      @accessMethod = ko.observable(null)
      @readyToDownload = ko.computed =>
        if !@dataset.granuleAccessOptions().canDownload
          true
        else
          @accessMethod()?

  exports = ServiceOptionsModel
