ns = @edsc.models.ui

ns.ProjectList = do (ko, window, doPost=jQuery.post, $ = jQuery) ->
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
        @showDataQualitySummaryAndDownload [dataset], =>
          @downloadDatasets([dataset])

    loginAndDownloadProject: =>
      @user.loggedIn =>
        @showDataQualitySummaryAndDownload @project.getDatasets(), =>
          @downloadDatasets(@project.getDatasets())

    showDataQualitySummaryAndDownload: (datasets, action) =>
      accepted = true
      for dataset in datasets
        if dataset.dqsModel.results().id && !dataset.dqsModel.results().accepted()
          accepted = false

      if accepted
        action()
      else
        @dataQualitySummaryCallback = =>
          @dataQualitySummaryCallback = null
          action()

        @_loadDataQualitySummaryModel(datasets)

    showDataQualitySummary: (datasets) =>
      @_loadDataQualitySummaryModel(datasets)

    _loadDataQualitySummaryModel: (datasets) =>
      summaries = []
      for dataset in datasets
        summary = {}
        summary["dataset"] = dataset
        summary["summary"] = dataset.dqsModel.results()
        summaries.push summary if summary["summary"].id

      @dataQualitySummaryModal(summaries)

    acceptDataQualitySummary: =>
      summaries = @dataQualitySummaryModal()
      dqs_ids = []
      for dqs in summaries
        dqs_ids.push dqs.summary.id

      data =
        dqs_ids: dqs_ids

      xhr = doPost '/accept_data_quality_summaries', data, (response) =>
        for dqs in summaries
          dqs.dataset.dqsModel.results().accepted(true)
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

    datasetsHaveDQS: =>
      result = false
      for dataset in @project.datasets()
        result = true if dataset.dqsModel.results().id

      result

    allDQSAccepted: =>
      result = true
      for dataset in @project.datasets()
        result = false if dataset.dqsModel.results().id && !dataset.dqsModel.results().accepted()

      result


  exports = ProjectList
