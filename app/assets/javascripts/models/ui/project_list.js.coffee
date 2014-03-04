ns = @edsc.models.ui

ns.ProjectList = do (ko, window, $ = jQuery) ->
  class ProjectList
    constructor: (@project, @user, @datasetResults) ->
      @visible = ko.observable(false)

      @datasetsToDownload = ko.computed(@_computeDatasetsToDownload, this, deferEvaluation: true)

      @dataQualitySummaryModal = ko.observable(false)
      @dataQualitySummaryCallback = null

    showProject: =>
      if @_selectedDataset?
        @project.selectedDatasetId(@_selectedDataset)
      else
        @selectFirstDataset()
      @_selectedDataset = null
      @visible(true)

    hideProject: =>
      @_selectedDataset = @project.selectedDatasetId()
      @project.selectedDatasetId(null)
      @visible(false)

    loginAndDownloadDataset: (dataset) =>
      @user.loggedIn =>
        @showDataQualitySummary [dataset], =>
          @downloadDatasets([dataset])

    loginAndDownloadProject: =>
      @user.loggedIn =>
        @showDataQualitySummary @project.getDatasets(), =>
          @downloadDatasets(@project.getDatasets())

    showDataQualitySummary: (datasets, action) =>
      for dataset in datasets
        if !dataset.dqsModel.results().id || dataset.dqsModel.results().accepted()
          action()
        else
          @dataQualitySummaryCallback = =>
            @dataQualitySummaryCallback = null
            action()

          @dataQualitySummaryModal([dataset, dataset.dqsModel.results()])

    acceptDataQualitySummary: =>
      @dataQualitySummaryModal()[0].dqsModel.results().accepted(true)
      @dataQualitySummaryModal(false)
      @dataQualitySummaryCallback?()

    cancelDataQualitySummaryModal: =>
      @dataQualitySummaryModal(false)

    downloadDatasets: (datasets) =>
      $project = $('#data-access-project')

      $project.val(JSON.stringify(@project.serialize(datasets)))

      $('#data-access').submit()

    selectFirstDataset: ->
      datasets = @project.datasets()
      selection = null
      selection = datasets[0].id() if datasets.length > 0
      @project.selectedDatasetId(selection)

    toggleDataset: (dataset) =>
      project = @project
      if project.hasDataset(dataset)
        project.removeDataset(dataset)
        @datasetResults.removeVisibleDataset(dataset) if @visible()
        @selectFirstDataset() if @isSelected(dataset)
      else
        project.addDataset(dataset)
        project.selectedDatasetId(dataset.id()) if @visible() && !project.selectedDatasetId()?

    _computeDatasetsToDownload: ->
      dataset for dataset in @project.datasets() when dataset.serviceOptions.accessMethod() == 'download'

    select: (dataset, event) =>
      $target = $(event?.target)
      return unless $target.closest('a').length == 0

      if @isSelected(dataset)
        @project.selectedDatasetId(null)
      else
        @project.selectedDatasetId(dataset.id())

    isSelected: (dataset) =>
      dataset.id() == @project.selectedDatasetId()

    hideFilters: =>
      @project.searchGranulesDataset(null)

  exports = ProjectList
