ns = @edsc.models.ui

ns.ProjectList = do (ko, window, $ = jQuery) ->
  class ProjectList
    constructor: (@project, @user, @datasetResults) ->
      @visible = ko.observable(false)

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
      $serialized = $('<div>')
      dataset_query = '<input name="dataset_query" type="text">'
      dataset_id = '<input name="datasets[][id]" type="text">'
      granule_query = '<input name="datasets[][granules]" type="text">'
      params = $.extend({}, @project.query.params())
      delete params.page_num
      delete params.page_size

      $serialized.append($(dataset_query).val(JSON.stringify(params)))

      console.log "Ordering without per-dataset customizations"
      for dataset in datasets
        id = dataset.id()
        $serialized.append($(dataset_id).val(id))
        if dataset.has_granules()
          # TODO: Eventually this will need to have per-dataset customizations
          granule_params = {echo_collection_id: id}
          $serialized.append($(granule_query).val(JSON.stringify(granule_params)))

      $('#data-access').empty().append($serialized).submit()

    toggleDataset: (dataset) =>
      project = @project
      if project.hasDataset(dataset)
        project.removeDataset(dataset)
        if @visible()
          @datasetResults.removeVisibleDataset(dataset)
      else
        project.addDataset(dataset)

  exports = ProjectList
