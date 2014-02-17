ns = @edsc.models.ui

ns.ProjectList = do (ko, window, $ = jQuery) ->
  class ProjectList
    constructor: (@project, @user, @datasetResults) ->
      @visible = ko.observable(false)

      @datasetsToDownload = ko.computed(@_computeDatasetsToDownload, this, deferEvaluation: true)

    showProject: =>
      @visible(true)

    hideProject: =>
      @visible(false)

    loginAndDownloadDataset: (dataset) =>
      @user.loggedIn =>
        @downloadDatasets([dataset])

    loginAndDownloadProject: =>
      @user.loggedIn =>
        @downloadDatasets(@project.getDatasets())

    downloadDatasets: (datasets) =>
      $project = $('#data-access-project')

      $project.val(JSON.stringify(@project.serialize()))

      $('#data-access').submit()

    toggleDataset: (dataset) =>
      project = @project
      if project.hasDataset(dataset)
        project.removeDataset(dataset)
        if @visible()
          @datasetResults.removeVisibleDataset(dataset)
        if @isSelected(dataset)
          datasets = project.datasets()
          selection = null
          selection = datasets[0] if datasets.length > 0
          project.selectedDatasetId(selection)
      else
        project.addDataset(dataset)
        project.selectedDatasetId(dataset.id()) unless project.selectedDatasetId()?

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

  exports = ProjectList
