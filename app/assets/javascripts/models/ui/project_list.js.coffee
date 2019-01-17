ns = @edsc.models.ui

ns.ProjectList = do (ko
                    window
                    document
                    urlUtil=@edsc.util.url
                    xhrUtil=@edsc.util.xhr
                    dateUtil=@edsc.util.date
                    deparam = @edsc.util.deparam
                    $ = jQuery
                    wait=@edsc.util.xhr.wait
                    ajax = @edsc.util.xhr.ajax) ->

  class ProjectList
    constructor: (@project, @collectionResults) ->
      @visible = ko.observable(false)
      @needsTemporalChoice = ko.observable(false)
      @moreDetailsActive = ko.observableArray()
      @downloadLinksActive = ko.observableArray()

      @collectionLinks = ko.computed(@_computeCollectionLinks, this, deferEvaluation: true)
      @collectionsToDownload = ko.computed(@_computeCollectionsToDownload, this, deferEvaluation: true)
      @collectionOnly = ko.computed(@_computeCollectionOnly, this, deferEvaluation: true)
      @submittedOrders = ko.computed(@_computeSubmittedOrders, this, deferEvaluation: true)
      @submittedServiceOrders = ko.computed(@_computeSubmittedServiceOrders, this, deferEvaluation: true)
      @submittedServiceOrderTotal = ko.computed(@_computeSubmittedServiceOrderTotal, this, deferEvaluation: true)
      @pollProjectUpdates = ko.computed(@_computeProjectUpdates, this, deferEvaluation: true)
      @pollingIntervalId = ko.observable(null)

      @allCollectionsVisible = ko.computed(@_computeAllCollectionsVisible, this, deferEvaluation: true)

      ko.computed(@_syncHitsCounts, this)

      $(window).on 'edsc.temporalchange', () =>
        @_determineTemporalOverride (optionStr) =>
          @_applyTemporalOverride(optionStr)
        true

      $(window).on 'edsc.focusset', () =>
        @_determineTemporalOverride (optionStr) =>
          @_applyTemporalOverride(optionStr)
        true

      $(window).on 'edsc.focusremove', () =>
        @_applyTemporalOverride(null)
        true

      $(document).ready(@_onReady)

    _syncHitsCounts: =>
      return unless @collectionResults? && @collectionResults.loadTime()?
      for projectCollection in @project.collections()
        found = false
        for result in @collectionResults.results() when result.id == projectCollection.collection.id
          found = true
          break
        projectCollection.collection.granuleDatasource()?.data() unless found

    _onReady: =>
      if window.location.href.indexOf('/data/retrieve') != -1
        @pollProjectUpdates()

    _launchDownload: (collection) =>
      # Ensure that the colletion is in the project
      if !@project.hasCollection(collection)
        @project.addCollection(collection, @configureProject)
      else
        @configureProject()

    awaitingStatus: =>
      @collectionsToDownload().length == 0 && @collectionOnly().length == 0 && @submittedOrders().length == 0 && @submittedServiceOrders().length == 0 && @collectionLinks().length == 0

    loginAndDownloadCollection: (collection) =>
      $('#delayOk').on 'click', =>
        @_launchDownload(collection)

      limit = false
      if collection.tags()
        if collection.tags()['edsc.collection_alerts']
          limit = collection.tags()['edsc.collection_alerts']['data']['limit']
      if limit && collection.granuleCount() > limit
        message = collection.tags()['edsc.collection_alerts']['data']['message']
        if message && message.length > 0
          $("#delayOptionalMessage").text("Message from data provider: " + message)
        else
          $("#delayOptionalMessage").text("")
        $("#delayWarningModal").modal('show')
      else
        @_launchDownload(collection)

    loginAndDownloadProject: =>
      @configureProject()

    configureProject: =>
      @showProjectPage()

    _determineTemporalOverride: (callback) ->
      if edsc.page.page() == 'project'
        query = @project.query
        focused = query.focusedTemporal()

        if focused
          focusedStr = [dateUtil.toISOString(focused[0]), dateUtil.toISOString(focused[1])].join(',')
          # If the query has a timeline selection
          if query.temporalComponent()?
            temporalStr = query.temporalComponent()
            @needsTemporalChoice(callback: callback, focusedStr: focusedStr, temporalStr: temporalStr)
          else
            callback(focusedStr)
        else
          callback(null)

    chooseTemporal: =>
      { callback, focusedStr, temporalStr } = @needsTemporalChoice()
      @needsTemporalChoice(false)
      callback(temporalStr)

    chooseOverride: =>
      { callback, focusedStr, temporalStr } = @needsTemporalChoice()
      @needsTemporalChoice(false)
      callback(focusedStr)

    _applyTemporalOverride: (optionStr) ->
      @project.query.overrideTemporal(optionStr)

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

        # Download links from the DAAC
        for m in projectCollection.serviceOptions.accessMethod() when m.type == 'download'
          collections.push
            title: title,
            links: collection.granuleDatasource()?.downloadLinks(id)
            order_status: m.orderStatus?.toLowerCase().replace(/_/g, ' ')
            error_code: m.errorCode
            error_message: m.errorMessage

        # OPeNDAP links
        for m in projectCollection.serviceOptions.accessMethod() when m.type == 'opendap'
          collections.push
            title: title,
            links: collection.granuleDatasource()?.opendapLinks(id)
            order_status: null
            error_code: null
            error_message: null

      collections

    _computeSubmittedOrders: ->
      orders = []
      id = @project.id()
      for projectCollection in @project.accessCollections()
        collection = projectCollection.collection
        collectionId = collection.id
        has_browse = collection.browseable_granule?
        for m in projectCollection.serviceOptions.accessMethod() when m.type == 'order'
          canCancel = ['SUBMITTING', 'QUOTED', 'NOT_VALIDATED', 'QUOTED_WITH_EXCEPTIONS', 'VALIDATED'].indexOf(m.orderStatus) != -1
          orders.push
            dataset_id: collection.dataset_id
            order_id: m.orderId
            order_status: m.orderStatus?.toLowerCase().replace(/_/g, ' ')
            order_status_to_classname: @orderStatusToClassName(m.orderStatus)
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
        )), 20000)
        @pollingIntervalId(intervalId)

    _computeSubmittedServiceOrders: ->
      serviceOrders = []
      id = @project.id()
      for projectCollection in @project.accessCollections()
        collection = projectCollection.collection
        collectionId = collection.id
        has_browse = collection.browseable_granule?

        for m in projectCollection.serviceOptions.accessMethod() when m.type == 'service'
          if m.serviceOptions
            total_processed = m.serviceOptions.total_processed
            total_number = m.serviceOptions.total_number
            total_orders = m.serviceOptions.total_orders
            total_complete = m.serviceOptions.total_complete
            download_urls = m.serviceOptions.download_urls
            orders = m.serviceOptions.orders
          else
            total_processed = 0
            total_number = 0
            total_orders = 0
            total_complete = 0
            download_urls = []
            orders = []

          is_more_details_active = @moreDetailsActive().indexOf(collection.id) > -1
          is_download_links_active = @downloadLinksActive().indexOf(collection.id) > -1
          percent_done = (total_processed / total_number * 100).toFixed(2)
          has_downloads_available = !$.isEmptyObject(download_urls)

          service_orders = []

          for order in orders
            service_orders.push
              order_id: order.order_id
              contact: order.contact
              order_status: order.order_status
              total_number: order.total_number
              total_processed: order.total_processed
              download_urls: order.download_urls
              percent_done: (order.total_processed / order.total_number * 100).toFixed(2)

          serviceOrders.push
            collection_id: collection.id
            dataset_id: collection.dataset_id
            order_id: m.orderId
            order_status: m.orderStatus
            order_status_to_classname: @orderStatusToClassName(m.orderStatus)
            is_in_progress: m.orderStatus != 'creating' && m.orderStatus != 'failed' && m.orderStatus != 'complete'
            download_urls: download_urls
            has_downloads_available: has_downloads_available
            total_processed: total_processed
            total_number: total_number
            percent_done: percent_done
            percent_done_str: percent_done + '%'
            downloadBrowseUrl: has_browse && urlUtil.fullPath("/granules/download.html?browse=true&project=#{id}&collection=#{collectionId}")
            error_code: m.errorCode
            error_message: m.errorMessage
            total_orders: total_orders
            complete_orders: total_complete
            orders: service_orders
            contact: if service_orders && service_orders.length then service_orders[0].contact else false
            is_more_details_active: is_more_details_active
            is_download_links_active: is_download_links_active
      serviceOrders

    _computeSubmittedServiceOrderTotal: ->
      serviceOrders = []
      serviceOrderTotal = 0
      for projectCollection in @project.accessCollections()
        for m in projectCollection.serviceOptions.accessMethod() when m.type == 'service'
          serviceOrderTotal += m.serviceOptions.orders.length
      serviceOrderTotal

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
      for projectCollection in @project.collections()
        projectCollection.collection.visible(visible)

    _computeAllCollectionsVisible: =>
      all_visible = true
      for projectCollection in @project.collections()
        all_visible = false if !projectCollection.collection.visible()
      all_visible

    showRelatedUrls: ->
      $('#related-urls-modal').modal('show')

    hideRelatedUrls: ->
      $('#related-urls-modal').modal('hide')

    showProjectPage: ->
      $(window).trigger('edsc.save_workspace')

      projectId = urlUtil.projectId()
      if projectId
        path = "/projects/#{projectId}"
      else
        path = '/projects/new?' + urlUtil.currentQuery()

      window.location.href = urlUtil.fullPath(path)

    toggleMoreDetails: (collection_data) =>
      if collection_data.collection_id not in @moreDetailsActive()
        @moreDetailsActive.push(collection_data.collection_id)
      else
        @moreDetailsActive.splice(@moreDetailsActive().indexOf(collection_data.collection_id), 1)

    toggleViewDownloads: (collection_data) =>
      if collection_data.collection_id not in @downloadLinksActive()
        @downloadLinksActive.push(collection_data.collection_id)
      else
        @downloadLinksActive.splice(@downloadLinksActive().indexOf(collection_data.collection_id), 1)

    orderStatusToClassName: (status) ->
      status.replace(' ', '-')

    getPageURL: ->
      window.location.href.replace(window.location.search, '')

  exports = ProjectList
