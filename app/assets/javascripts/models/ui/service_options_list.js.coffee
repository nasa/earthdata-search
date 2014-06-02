ns = @edsc.models.ui

ns.ServiceOptionsList = do (ko, $=jQuery) ->
  class ServiceOptionsList
    constructor: (@accountForm, @projectList) ->
      @activeIndex = ko.observable(0)
      @showGranules = ko.observable(false)
      @needsContactInfo = ko.computed =>
        for dataset in @projectList.project.datasets()
          for m in dataset.serviceOptions.accessMethod()
            method = m.method()
            return true if method? && method != 'Download'
        false
      @isLastOption = ko.computed =>
        datasets = @projectList.project.datasets()
        @activeIndex() == datasets.length - 1 && !@needsContactInfo()

    showNext: =>
      @activeIndex(@activeIndex() + 1)

    showPrevious: =>
      @activeIndex(@activeIndex() - 1)

    submitRequest: =>
      $('.access-submit').prop('disabled', true)
      if @accountForm.isEditingAccount()
        @accountForm.saveAccountEdit =>
          @projectList.downloadDatasets(@projectList.project.getDatasets())
        # re-enable button if saveAccountEdit fails
        $('.access-submit').prop('disabled', false)
      else
        @projectList.downloadDatasets(@projectList.project.getDatasets())

    showGranuleList: =>
      @showGranules(true)

    hideGranuleList: =>
      @showGranules(false)

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        dataset = @projectList.project.datasets()[@activeIndex()]
        dataset.granulesModel.loadNextPage()


  exports = ServiceOptionsList
