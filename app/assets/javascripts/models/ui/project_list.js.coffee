ns = @edsc.models.ui

ns.ProjectList = do (ko, window, doPost=jQuery.post, $ = jQuery) ->
  class ProjectList
    constructor: (@project, @user, @datasetResults) ->
      @visible = ko.observable(false)

      @datasetsToDownload = ko.computed(@_computeDatasetsToDownload, this, deferEvaluation: true)

      @dataQualitySummaryModal = ko.observable(false)
      @dataQualitySummaryCallback = null

    showProject: =>
      @visible(true)

    hideProject: =>
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
        if dataset.dqsModel.results()?
          for s in dataset.dqsModel.results()
            summary["dataset"] = dataset
            summary["summary"] = s
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
          for s in dqs.dataset.dqsModel.results()
            s.accepted(true)
          @dataQualitySummaryModal(false)

        @dataQualitySummaryCallback?()

    cancelDataQualitySummaryModal: =>
      @dataQualitySummaryModal(false)

    downloadDatasets: (datasets) =>
      $project = $('#data-access-project')

      $project.val(JSON.stringify(@project.serialize(datasets)))

      $('#data-access').submit()

    toggleDataset: (dataset) =>
      project = @project
      if project.hasDataset(dataset)
        project.removeDataset(dataset)
      else
        project.addDataset(dataset)

    _computeDatasetsToDownload: ->
      dataset for dataset in @project.datasets() when dataset.serviceOptions.accessMethod() == 'download'

    datasetsHaveDQS: =>
      result = false
      for dataset in @project.datasets()
        result = true if dataset.dqsModel.results()?.length > 0

      result

    allDQSAccepted: =>
      result = true
      for dataset in @project.datasets()
        if dataset.dqsModel.results()?.length > 0
          for dqs in dataset.dqsModel.results()
            result = false if !dqs.accepted()

      result

    showFilters: (dataset) =>
      if @project.searchGranulesDataset(dataset)
        $('.granule-temporal-filter').temporalSelectors({
          uiModel: dataset.granulesModel.temporal,
          modelPath: "project.searchGranulesDataset().granulesModel.temporal.pending",
          prefix: 'granule'
        })

    applyFilters: =>
      $('.master-overlay-content #temporal-submit').click()
      @hideFilters()

    hideFilters: =>
      $('.master-overlay').addClass('is-master-overlay-secondary-hidden')
      @project.searchGranulesDataset(null)

  exports = ProjectList
