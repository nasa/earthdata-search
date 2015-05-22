ns = @edsc.models.ui

ns.ProjectList = do (ko
                    window
                    document
                    urlUtil=@edsc.util.url
                    xhrUtil=@edsc.util.xhr
                    dateUtil=@edsc.util.date
                    $ = jQuery
                    wait=@edsc.util.xhr.wait
                    ajax = @edsc.util.xhr.ajax) ->

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
      @needsTemporalChoice = ko.observable(false)

      @datasetLinks = ko.computed(@_computeDatasetLinks, this, deferEvaluation: true)
      @datasetsToDownload = ko.computed(@_computeDatasetsToDownload, this, deferEvaluation: true)
      @datasetOnly = ko.computed(@_computeDatasetOnly, this, deferEvaluation: true)
      @submittedOrders = ko.computed(@_computeSubmittedOrders, this, deferEvaluation: true)
      @submittedServiceOrders = ko.computed(@_computeSubmittedServiceOrders, this, deferEvaluation: true)

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
      @_sortOutTemporalMalarkey (optionStr) ->
        singleGranuleParam = if singleGranuleId? then "&sgd=#{encodeURIComponent(singleGranuleId)}" else ""
        backParam = "&back=#{encodeURIComponent(urlUtil.cleanPath().split('?')[0])}"
        path = '/data/configure?' + urlUtil.realQuery() + singleGranuleParam + optionStr + backParam
        if window.tokenExpiresIn?
          window.location.href = path
        else
          window.location.href = "/login?next_point=#{encodeURIComponent(path)}"

    _sortOutTemporalMalarkey: (callback) ->
      querystr = urlUtil.currentQuery()
      query = @project.query
      focused = query.focusedTemporal()
      # If the query has a timeline selection
      if focused
        focusedStr = '&ot=' + encodeURIComponent([dateUtil.toISOString(focused[0]), dateUtil.toISOString(focused[1])].join(','))
        # If the query has a temporal component
        if querystr.match(/[\?\&\[]qt\]?=/)
          @needsTemporalChoice(callback: callback, focusedStr: focusedStr)
        else
          callback(focusedStr)
      else
        callback('')

    chooseTemporal: =>
      {callback} = @needsTemporalChoice()
      @needsTemporalChoice(false)
      callback('')

    chooseOverride: =>
      {callback, focusedStr} = @needsTemporalChoice()
      @needsTemporalChoice(false)
      callback(focusedStr)

    toggleDataset: (dataset) =>
      project = @project
      if project.hasDataset(dataset)
        project.removeDataset(dataset)
      else
        dataset.makeRecent()
        project.addDataset(dataset)

    _computeDatasetLinks: ->
      datasets = []
      for projectDataset in @project.accessDatasets()
        dataset = projectDataset.dataset
        title = dataset.dataset_id
        links = []
        for link in dataset.links ? [] when link.rel.indexOf('metadata#') != -1
          links.push
            title: link.title ? link.href
            href: link.href
        if links.length > 0
          datasets.push
            dataset_id: title
            links: links
      datasets

    _computeDatasetsToDownload: ->
      datasets = []
      id = @project.id()
      return datasets unless id?
      for projectDataset in @project.accessDatasets()
        dataset = projectDataset.dataset
        has_browse = dataset.browseable_granule?
        datasetId = dataset.id
        title = dataset.dataset_id
        for m in projectDataset.serviceOptions.accessMethod() when m.type == 'download'
          datasets.push
            title: title
            downloadPageUrl: "/granules/download.html?project=#{id}&dataset=#{datasetId}"
            downloadScriptUrl: "/granules/download.sh?project=#{id}&dataset=#{datasetId}"
            downloadBrowseUrl: has_browse && "/granules/download.html?browse=true&project=#{id}&dataset=#{datasetId}"

      datasets

    _computeSubmittedOrders: ->
      orders = []
      id = @project.id()
      for projectDataset in @project.accessDatasets()
        dataset = projectDataset.dataset
        datasetId = dataset.id
        has_browse = dataset.browseable_granule?
        for m in projectDataset.serviceOptions.accessMethod() when m.type == 'order'
          canCancel = ['QUOTED', 'NOT_VALIDATED', 'QUOTED_WITH_EXCEPTIONS', 'VALIDATED'].indexOf(m.orderStatus) != -1
          orders.push
            dataset_id: dataset.dataset_id
            order_id: m.orderId
            order_status: m.orderStatus?.toLowerCase().replace(/_/g, ' ')
            cancel_link: "/data/remove?order_id=#{m.orderId}" if canCancel
            downloadBrowseUrl: has_browse && "/granules/download.html?browse=true&project=#{id}&dataset=#{datasetId}"
      orders

    _computeSubmittedServiceOrders: ->
      serviceOrders = []
      id = @project.id()
      for projectDataset in @project.accessDatasets()
        dataset = projectDataset.dataset
        datasetId = dataset.id
        has_browse = dataset.browseable_granule?
        for m in projectDataset.serviceOptions.accessMethod() when m.type == 'service'
          if m.orderStatus == 'processing' || m.orderStatus == 'submitting'
            console.log "Loading project data for #{id}"
            url = window.location.href + '.json'
            setTimeout((=> ajax
              dataType: 'json'
              url: url
              retry: => @_computeSubmittedServiceOrders()
              success: (data, status, xhr) =>
                console.log "Finished loading project data for #{id}"
                @project.fromJson(data))
            , 5000)

          serviceOrders.push
            dataset_id: dataset.dataset_id
            order_id: m.orderId
            order_status: m.orderStatus
            download_urls: m.serviceOptions.download_urls
            number_processed: m.serviceOptions.number_processed
            total_number: m.serviceOptions.total_number
            downloadBrowseUrl: has_browse && "/granules/download.html?browse=true&project=#{id}&dataset=#{datasetId}"
      serviceOrders

    _computeDatasetOnly: ->
      datasets = []
      for dataset in @project.accessDatasets()
        datasets.push(dataset) if dataset.serviceOptions.accessMethod().length == 0
      datasets

    showFilters: (dataset) =>
      if @project.searchGranulesDataset(dataset)
        $('.granule-temporal-filter').temporalSelectors({
          uiModel: dataset.granulesModel.temporal,
          modelPath: "(project.searchGranulesDataset() ? project.searchGranulesDataset().granulesModel.temporal.pending : null)",
          prefix: 'granule'
        })

    applyFilters: =>
      $('.master-overlay-content .temporal-submit').click()
      @hideFilters()

    hideFilters: =>
      $('.master-overlay').addClass('is-master-overlay-secondary-hidden')
      @project.searchGranulesDataset(null)

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
