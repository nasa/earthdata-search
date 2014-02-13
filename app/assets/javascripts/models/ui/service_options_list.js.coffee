ns = @edsc.models.ui

ns.ServiceOptionsList = do (ko) ->
  class ServiceOptionsList
    constructor: ->
      @activeIndex = ko.observable(0)

    showNext: =>
      @activeIndex(@activeIndex() + 1)

    showPrevious: =>
      @activeIndex(@activeIndex() - 1)

  exports = ServiceOptionsList
