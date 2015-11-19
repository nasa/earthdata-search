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

      @allCollectionsVisible = ko.computed(@_computeAllCollectionsVisible, this, deferEvaluation: true)

      $(document).ready(@_onReady)

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

    loginAndDownloadGranule: (collection, granule) =>
      @project.focus(collection)
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

    toggleCollection: (collection) =>
      project = @project
      if project.hasCollection(collection)
        project.removeCollection(collection)
      else
        collection.makeRecent()
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
            title: title
            downloadPageUrl: "/granules/download.html?project=#{id}&collection=#{collectionId}"
            downloadScriptUrl: "/granules/download.sh?project=#{id}&collection=#{collectionId}"
            downloadBrowseUrl: has_browse && "/granules/download.html?browse=true&project=#{id}&collection=#{collectionId}"

      collections

    _computeSubmittedOrders: ->
      orders = []
      id = @project.id()
      for projectCollection in @project.accessCollections()
        collection = projectCollection.collection
        collectionId = collection.id
        has_browse = collection.browseable_granule?
        for m in projectCollection.serviceOptions.accessMethod() when m.type == 'order'
          canCancel = ['QUOTED', 'NOT_VALIDATED', 'QUOTED_WITH_EXCEPTIONS', 'VALIDATED'].indexOf(m.orderStatus) != -1
          orders.push
            dataset_id: collection.dataset_id
            order_id: m.orderId
            order_status: m.orderStatus?.toLowerCase().replace(/_/g, ' ')
            cancel_link: "/data/remove?order_id=#{m.orderId}" if canCancel
            downloadBrowseUrl: has_browse && "/granules/download.html?browse=true&project=#{id}&collection=#{collectionId}"
      orders

    _computeSubmittedServiceOrders: ->
      serviceOrders = []
      id = @project.id()
      for projectCollection in @project.accessCollections()
        collection = projectCollection.collection
        collectionId = collection.id
        has_browse = collection.browseable_granule?
        for m in projectCollection.serviceOptions.accessMethod() when m.type == 'service'
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

          number_processed = m.serviceOptions.number_processed
          total_number = m.serviceOptions.total_number
          percent_done = (number_processed / total_number * 100).toFixed(0)

          serviceOrders.push
            dataset_id: collection.dataset_id
            order_id: m.orderId
            order_status: m.orderStatus
            is_in_progress: m.orderStatus != 'submitting' && m.orderStatus != 'failed' && m.orderStatus != 'complete'
            download_urls: m.serviceOptions.download_urls
            number_processed: m.serviceOptions.number_processed
            total_number: m.serviceOptions.total_number
            percent_done: percent_done
            percent_done_str: percent_done + '%'
            downloadBrowseUrl: has_browse && "/granules/download.html?browse=true&project=#{id}&collection=#{collectionId}"
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
      if @project.searchGranulesCollection(collection)
        $('.granule-temporal-filter').temporalSelectors({
          uiModel: collection.granuleDatasource().cmrData().temporal,
          modelPath: "(project.searchGranulesCollection() ? project.searchGranulesCollection().granuleDatasource().cmrData().temporal.pending : null)",
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
