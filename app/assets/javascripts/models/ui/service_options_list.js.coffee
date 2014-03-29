ns = @edsc.models.ui

ns.ServiceOptionsList = do (ko) ->
  class ServiceOptionsList
    constructor: (@accountForm, @projectList) ->
      @activeIndex = ko.observable(0)

    showNext: =>
      @activeIndex(@activeIndex() + 1)

    showPrevious: =>
      @activeIndex(@activeIndex() - 1)

    submitRequest: =>
      if @accountForm.isEditingAccount()
        @accountForm.saveAccountEdit =>
          @projectList.loginAndDownloadProject()
      else
        @projectList.loginAndDownloadProject()

  exports = ServiceOptionsList
