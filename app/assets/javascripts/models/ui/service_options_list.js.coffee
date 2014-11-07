ns = @edsc.models.ui

ns.ServiceOptionsList = do (ko, $=jQuery) ->
  class ServiceOptionsList
    constructor: (@accountForm, @project) ->
      @activeIndex = ko.observable(0)
      @showGranules = ko.observable(false)
      @needsContactInfo = ko.computed =>
        for dataset in @project.accessDatasets()
          for m in dataset.serviceOptions.accessMethod()
            method = m.method()
            return true if method? && method != 'Download'
        false
      @isLastOption = ko.computed =>
        datasets = @project.accessDatasets()
        @activeIndex() == datasets.length - 1 && !@needsContactInfo()

    showNext: =>
      @activeIndex(@activeIndex() + 1)

    showPrevious: =>
      @activeIndex(@activeIndex() - 1)

    submitRequest: =>
      $('.access-submit').prop('disabled', true)
      if @needsContactInfo() && @accountForm.isEditingAccount()
        @accountForm.saveAccountEdit =>
          @downloadProject()
        # re-enable button if saveAccountEdit fails
        $('.access-submit').prop('disabled', false)
      else
        @downloadProject()

    showGranuleList: =>
      @showGranules(true)

    hideGranuleList: =>
      @showGranules(false)

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        dataset = @project.accessDatasets()[@activeIndex()].dataset
        dataset.granulesModel.loadNextPage()

    downloadProject: ->
      $project = $('#data-access-project')

      $project.val(JSON.stringify(@project.serialize()))
      $('#data-access').submit()


  exports = ServiceOptionsList
