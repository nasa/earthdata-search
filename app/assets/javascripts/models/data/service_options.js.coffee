ns = @edsc.models.data

ns.ServiceOptions = do (ko) ->
  class ServiceOptionsModel
    constructor: () ->
      @accessMethod = ko.observable(null)
      @readyToDownload = ko.computed =>
        @accessMethod()?

  exports = ServiceOptionsModel
