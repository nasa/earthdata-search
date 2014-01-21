ns = @edsc.models.data

ns.Project = do (ko) ->

  class Project
    constructor: ->
      @datasets = ko.observableArray()

    toggleDataset: (dataset) =>
      datasets = @datasets
      if datasets.contains(dataset)
        datasets.remove(dataset)
      else
        datasets.push(dataset)


  exports = Project
