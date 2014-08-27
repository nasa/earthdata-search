ns = @edsc.models.ui

ns.ProjectList = do (ko, window, document, urlUtil=@edsc.util.url, xhrUtil=@edsc.util.xhr, $ = jQuery) ->

  sortable = (root) ->
    $root = $(root)
    $placeholder = $("<li class=\"sortable-placeholder\"/>")

    index = null
    $dragging = null

    $root.on 'dragstart.sortable', '> *', (e) ->
      dt = e.originalEvent.dataTransfer;
      dt.effectAllowed = 'move';
      dt.setData('Text', 'dummy');
      $dragging = $(this)
      index = $dragging.index();

    $root.on 'dragend.sortable', '> *', (e) ->
      $dragging.show()
      $placeholder.detach()
      startIndex = index
      endIndex = $dragging.index()
      if startIndex != endIndex
        $root.trigger('sortupdate', startIndex: startIndex, endIndex: endIndex)
      $dragging = null

    $root.on 'drop.sortable', '> *', (e) ->
      e.stopPropagation()
      $placeholder.after($dragging)
      false

    $root.on 'dragover.sortable dragenter.sortable', '> *', (e) ->
      e.preventDefault()
      e.originalEvent.dataTransfer.dropEffect = 'move';
      $dragging.hide().appendTo($root) # appendTo to ensure top margins are ok
      if $placeholder.index() < $(this).index()
        $(this).after($placeholder)
      else
        $(this).before($placeholder)
      false

  class ProjectList
    constructor: (@project, @datasetResults) ->
      @visible = ko.observable(false)

      @datasetsToDownload = ko.computed(@_computeDatasetsToDownload, this, deferEvaluation: true)
      @datasetOnly = ko.computed(@_computeDatasetOnly, this, deferEvaluation: true)
      @submittedOrders = ko.computed(@_computeSubmittedOrders, this, deferEvaluation: true)

      @allDatasetsVisible = ko.computed(@_computeAllDatasetsVisible, this, deferEvaluation: true)

      $(document).ready(@_onReady)

    _onReady: =>
      sortable('#project-datasets-list')
      $('#project-datasets-list').on 'sortupdate', (e, {item, startIndex, endIndex}) =>
        datasets = @project.datasets().concat()
        [dataset] = datasets.splice(startIndex, 1)
        datasets.splice(endIndex, 0, dataset)
        @project.datasets(datasets)

    loginAndDownloadDataset: (dataset) =>
      @project.focus(dataset)
      @configureProject()

    loginAndDownloadGranule: (dataset, granule) =>
      @project.focus(dataset)
      @configureProject(granule.id)

    loginAndDownloadProject: =>
      @configureProject()

    configureProject: (singleGranuleId=null) ->
      singleGranuleParam = if singleGranuleId? then "&sgd=#{singleGranuleId}" else ""
      path = '/data/configure?' + urlUtil.realQuery() + singleGranuleParam
      if window.tokenExpiresIn?
        window.location.href = path
      else
        window.location.href = "/login?next_point=#{encodeURIComponent(path)}"

    toggleDataset: (dataset) =>
      project = @project
      if project.hasDataset(dataset)
        project.removeDataset(dataset)
      else
        dataset.makeRecent()
        project.addDataset(dataset)

    _computeDatasetsToDownload: ->
      datasets = []
      id = @project.id()
      return datasets unless id?
      for projectDataset in @project.accessDatasets()
        dataset = projectDataset.dataset
        datasetId = dataset.id
        title = dataset.dataset_id
        for m in projectDataset.serviceOptions.accessMethod() when m.type == 'download'
          datasets.push
            title: title
            downloadPageUrl: "/granules/download.html?project=#{id}&dataset=#{datasetId}"
            downloadScriptUrl: "/granules/download.sh?project=#{id}&dataset=#{datasetId}"

      datasets

    _computeSubmittedOrders: ->
      orders = []
      for dataset in @project.accessDatasets()
        for m in dataset.serviceOptions.accessMethod() when m.type == 'order'
          orders.push(url: "https://reverb.echo.nasa.gov/reverb/orders/#{m.orderId}", dataset_id: dataset.dataset.dataset_id)
      orders

    _computeDatasetOnly: ->
      datasets = []
      for dataset in @project.accessDatasets()
        datasets.push(dataset) if dataset.serviceOptions.accessMethod().length == 0
      datasets

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
      @project.searchGranulesDataset(null)

    _destroyGranulePickers: ->
      $('.granule-temporal-filter .temporal').datetimepicker('destroy')

    toggleViewAllDatasets: =>
      visible = !@allDatasetsVisible()
      for dataset in @project.datasets()
        dataset.visible(visible)

    _computeAllDatasetsVisible: =>
      all_visible = true
      for dataset in @project.datasets()
        all_visible = false if !dataset.visible()
      all_visible

  exports = ProjectList
