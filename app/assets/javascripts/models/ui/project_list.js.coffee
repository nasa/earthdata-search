ns = @edsc.models.ui

ns.ProjectList = do (ko, window, doPost=jQuery.post, $ = jQuery) ->

  class ProjectList
    constructor: (@project, @user, @datasetResults) ->
      @visible = ko.observable(false)

      @datasetsToDownload = ko.computed(@_computeDatasetsToDownload, this, deferEvaluation: true)
      @submittedOrders = ko.computed(@_computeSubmittedOrders, this, deferEvaluation: true)

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
        results = dataset.dqsModel.results()
        if results?
          for result in results
            if result.id && !result.accepted()
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
        # Force dataset to load DQS information
        @datasetHasDQS(dataset)
        project.addDataset(dataset)

    _computeDatasetsToDownload: ->
      datasets = []
      for dataset in @project.datasets()
        for m in dataset.serviceOptions.accessMethod()
          datasets.push(dataset) if m.type == 'download'

      datasets

    _computeSubmittedOrders: ->
      orders = []
      for dataset in @project.datasets()
        for m in dataset.serviceOptions.accessMethod() when m.type == 'order'
          orders.push(url: "https://reverb.echo.nasa.gov/reverb/orders/#{m.orderId}", dataset_id: dataset.dataset_id)
      orders

    datasetHasDQS: (dataset) =>
      result = true if dataset.dqsModel.results()?.length > 0

    datasetsHaveDQS: =>
      result = false
      result ||= @datasetHasDQS(dataset) for dataset in @project.datasets()
      result

    dqsAccepted: (dataset) =>
      if dataset.dqsModel.results()?.length > 0
        # Resize the list after DQS warning is displayed
        $('.master-overlay').masterOverlay('contentHeightChanged')

        for dqs in dataset.dqsModel.results()
          return false unless dqs.accepted()
      true

    allDQSAccepted: =>
      result = true
      result &&= @dqsAccepted(dataset) for dataset in @project.datasets()
      result

    showFilters: (dataset) =>
      if @project.searchGranulesDataset(dataset)
        @_destroyGranulePickers()
        $('.granule-temporal-filter').temporalSelectors({
          uiModel: dataset.granulesModel.temporal,
          modelPath: "(project.searchGranulesDataset() ? project.searchGranulesDataset().granulesModel.temporal.pending : null)",
          prefix: 'granule'
        })

    applyFilters: =>
      $('.master-overlay-content .temporal-submit').click()
      @hideFilters()

    hideFilters: =>
      @_destroyGranulePickers()
      $('.master-overlay').addClass('is-master-overlay-secondary-hidden')
      @project.clearSearchGranules()

    _destroyGranulePickers: ->
      $('.granule-temporal-filter .temporal').datetimepicker('destroy')


  exports = ProjectList
