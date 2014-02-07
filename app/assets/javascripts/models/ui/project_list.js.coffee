ns = @edsc.models.ui

ns.ProjectList = do (ko, window) ->
  class ProjectList
    constructor: (@project, @datasetResults) ->
      @visible = ko.observable(false)

    showProject: =>
      @visible(true)

    hideProject: =>
      @visible(false)

    toggleDataset: (dataset) =>
      project = @project
      if project.hasDataset(dataset)
        project.removeDataset(dataset)
        if @visible()
          @datasetResults.removeVisibleDataset(dataset)
      else
        project.addDataset(dataset)


  exports = ProjectList
