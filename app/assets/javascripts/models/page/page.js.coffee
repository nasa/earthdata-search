ns = @edsc.models.page

ns.Page = do (ko, $ = jQuery) ->
  class Page
    constructor : (@page) ->
        @page = ko.observable(@page)

    hideParent: =>
      $('.master-overlay').masterOverlay('manualHideParent')

    showParent: =>
      $('.master-overlay').masterOverlay('manualShowParent')
