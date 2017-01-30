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
    constructor: (@project, @collectionResults) ->
      @visible = ko.observable(false)
      @needsTemporalChoice = ko.observable(false)

      @collectionLinks = ko.computed(@_computeCollectionLinks, this, deferEvaluation: true)
      @collectionsToDownload = ko.computed(@_computeCollectionsToDownload, this, deferEvaluation: true)
      @collectionOnly = ko.computed(@_computeCollectionOnly, this, deferEvaluation: true)
      @submittedOrders = ko.computed(@_computeSubmittedOrders, this, deferEvaluation: true)
      @submittedServiceOrders = ko.computed(@_computeSubmittedServiceOrders, this, deferEvaluation: true)
      @pollProjectUpdates = ko.computed(@_computeProjectUpdates, this, deferEvaluation: true)
      @pollingIntervalId = ko.observable(null)

      @allCollectionsVisible = ko.computed(@_computeAllCollectionsVisible, this, deferEvaluation: true)

      # Ensure
      ko.computed(@_syncHitsCounts, this)

      $(document).ready(@_onReady)

    _syncHitsCounts: =>
      return unless @collectionResults? && @collectionResults.loadTime()?
      for collection in @project.collections()
        found = false
        for result in @collectionResults.results() when result.id == collection.id
          found = true
          break
        collection.granuleDatasource()?.data() unless found

    _onReady: =>
      sortable('#project-collections-list')
      $('#project-collections-list').on 'sortupdate', (e, {item, startIndex, endIndex}) =>
        collections = @project.collections().concat()
        [collection] = collections.splice(startIndex, 1)
        collections.splice(endIndex, 0, collection)
        @project.collections(collections)

    loginAndDownloadCollection: (collection) =>
      @project.focus(collection)
      @configureProject()

    viewProject: () =>
      [base, parameters] = urlUtil.cleanPath()?.split('?')
      base = base + "/project" unless base.indexOf("/project") >= 0
      urlUtil.pushPath(base + "?" + parameters)

    loginAndDownloadGranule: (collection, granule) =>
      @project.focus(collection)
      @configureProject(granule.id)

    loginAndDownloadProject: =>
      @configureProject()

    configureProject: (singleGranuleId=null) ->
      @_sortOutTemporalMalarkey (optionStr) ->
        singleGranuleParam = if singleGranuleId? then "&sgd=#{encodeURIComponent(singleGranuleId)}" else ""
        backParam = "&back=#{encodeURIComponent(urlUtil.fullPath(urlUtil.cleanPath().split('?')[0]))}"
        path = '/data/configure?' + urlUtil.realQuery() + singleGranuleParam + optionStr + backParam
        window.location.href = urlUtil.fullPath(path)

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

    toggleCollection: (collection) =>
      project = @project
      if project.hasCollection(collection)
        project.removeCollection(collection)
      else
        project.addCollection(collection)

    _computeCollectionLinks: ->
      collections = []
      for projectCollection in @project.accessCollections()
        collection = projectCollection.collection
        title = collection.dataset_id
        links = []
        for link in collection.links ? [] when link.rel.indexOf('metadata#') != -1
          links.push
            title: link.title ? link.href
            href: link.href
        if links.length > 0
          collections.push
            dataset_id: title
            links: links
      collections

    _computeCollectionsToDownload: ->
      collections = []
      id = @project.id()
      return collections unless id?
      for projectCollection in @project.accessCollections()
        collection = projectCollection.collection
        has_browse = collection.browseable_granule?
        collectionId = collection.id
        title = collection.dataset_id
        for m in projectCollection.serviceOptions.accessMethod() when m.type == 'download'
          collections.push
            title: title,
            links: collection.granuleDatasource()?.downloadLinks(id)
            order_status: m.orderStatus?.toLowerCase().replace(/_/g, ' ')
            error_code: m.errorCode
            error_message: m.errorMessage

      collections

    _computeSubmittedOrders: ->
      orders = []
      id = @project.id()
      for projectCollection in @project.accessCollections()
        collection = projectCollection.collection
        collectionId = collection.id
        has_browse = collection.browseable_granule?
        for m in projectCollection.serviceOptions.accessMethod() when m.type == 'order'
          @pollProjectUpdates()
          canCancel = ['SUBMITTING', 'QUOTED', 'NOT_VALIDATED', 'QUOTED_WITH_EXCEPTIONS', 'VALIDATED'].indexOf(m.orderStatus) != -1
          orders.push
            dataset_id: collection.dataset_id
            order_id: m.orderId
            order_status: m.orderStatus?.toLowerCase().replace(/_/g, ' ')
            cancel_link: urlUtil.fullPath("/data/remove?order_id=#{m.orderId}") if canCancel
            is_in_progress: m.orderStatus == 'creating' || m.orderStatus.indexOf('PROCESSING') == 0 || canCancel
            dropped_granules: m.droppedGranules
            downloadBrowseUrl: has_browse && urlUtil.fullPath("/granules/download.html?browse=true&project=#{id}&collection=#{collectionId}")
            method_name: m.method()
            error_code: m.errorCode
            error_message: m.errorMessage
      orders


    _computeProjectUpdates: ->
      shouldPoll = false
      submitted = @submittedOrders().concat(@submittedServiceOrders())
      for order in submitted when order.is_in_progress || order.order_status == 'creating'
        shouldPoll = true
        break

      intervalId = @pollingIntervalId.peek()
      if !shouldPoll && intervalId
        clearInterval(intervalId)
        @pollingIntervalId(null)
      else if shouldPoll && !intervalId
        url = window.location.href + '.json'
        console.log "Loading project data for #{@project.id()}"
        intervalId = setInterval((=> ajax(
          dataType: 'json'
          url: url
          success: (data, status, xhr) =>
            console.log "Finished loading project data for #{@project.id()}"
            @project.fromJson(data)
          complete: =>
            shouldPoll = false
        )), 5000)
        @pollingIntervalId(intervalId)

    _computeSubmittedServiceOrders: ->
      serviceOrders = []
      id = @project.id()
      for projectCollection in @project.accessCollections()
        collection = projectCollection.collection
        collectionId = collection.id
        has_browse = collection.browseable_granule?
        for m in projectCollection.serviceOptions.accessMethod() when m.type == 'service'
          @pollProjectUpdates()
          number_processed = m.serviceOptions.number_processed
          total_number = m.serviceOptions.total_number
          percent_done = (number_processed / total_number * 100).toFixed(0)

          serviceOrders.push
            dataset_id: collection.dataset_id
            order_id: m.orderId
            order_status: m.orderStatus
            is_in_progress: m.orderStatus != 'creating' && m.orderStatus != 'failed' && m.orderStatus != 'complete'
            download_urls: m.serviceOptions.download_urls
            number_processed: m.serviceOptions.number_processed
            total_number: m.serviceOptions.total_number
            percent_done: percent_done
            percent_done_str: percent_done + '%'
            downloadBrowseUrl: has_browse && urlUtil.fullPath("/granules/download.html?browse=true&project=#{id}&collection=#{collectionId}")
            error_code: m.errorCode
            error_message: m.errorMessage
      serviceOrders

    _computeCollectionOnly: ->
      collections = []
      for collection in @project.accessCollections()
        collections.push(collection) if collection.serviceOptions.accessMethod().length == 0
      collections

    # FIXME: This must be moved to granules list. Why is it here?!
    showFilters: (collection) =>
      temporal = collection.granuleDatasource().data().temporal
      if @project.searchGranulesCollection(collection)
        $('.granule-temporal-filter').temporalSelectors({
          uiModel: temporal,
          modelPath: "(project.searchGranulesCollection() ? project.searchGranulesCollection().granuleDatasource().data().temporal.pending : null)",
          prefix: 'granule'
        })

    applyFilters: =>
      $('.master-overlay-content .temporal-submit').click()
      @hideFilters()

    hideFilters: =>
      $('.master-overlay').addClass('is-master-overlay-secondary-hidden')
      @project.searchGranulesCollection(null)

    toggleViewAllCollections: =>
      visible = !@allCollectionsVisible()
      for collection in @project.collections()
        collection.visible(visible)

    _computeAllCollectionsVisible: =>
      all_visible = true
      for collection in @project.collections()
        all_visible = false if !collection.visible()
      all_visible

  exports = ProjectList
