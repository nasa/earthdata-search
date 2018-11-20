#= require models/data/query
#= require models/data/collections
#= require models/data/collection
#= require models/data/variables

ns = @edsc.models.data

ns.Project = do (ko,
                 document
                 $ = jQuery
                 extend = $.extend
                 param = $.param
                 deparam = @edsc.util.deparam
                 ajax = @edsc.util.xhr.ajax
                 urlUtil = @edsc.util.url
                 QueryModel = ns.query.CollectionQuery
                 CollectionsModel = ns.Collections
                 VariablesModel = ns.Variables
                 ServiceOptionsModel = ns.ServiceOptions
                 Collection = ns.Collection
                 QueryParam = ns.QueryParam) ->

  # Maintains a finite pool of values to be distributed on demand.  Calling
  # next() on the pool returns either an unused value, prioritizing those
  # which have been returned to the pool most recently or, in the case where
  # there are no unused values, the value which has been checked out of the
  # pool the longest.
  class ValuePool
    constructor: (values) ->
      @_pool = values.concat()

    use: (value) ->
      @_remove(value)
      @_pool.push(value)
      value

    next: ->
      @use(@_pool[0])

    has: (value) ->
      @_pool.indexOf(value) != -1

    unuse: (value) ->
      @_remove(value)
      @_pool.unshift(value)
      value

    _remove: (value) ->
      index = @_pool.indexOf(value)
      @_pool.splice(index, 1) unless index == -1

  colorPool = new ValuePool([
    '#3498DB',
    '#E67E22',
    '#2ECC71',
    '#E74C3C',
    '#9B59B6'
  ])

  # Currently supported UMM-S Record Types
  supportedServiceTypes = ['OPeNDAP', 'ESI', 'ECHO ORDERS']

  class ProjectCollection
    constructor: (@project, @collection, @meta={}) ->
      @collection.reference()
      @meta.color ?= colorPool.next()

      @granuleAccessOptions = ko.asyncComputed({}, 100, @_loadGranuleAccessOptions, this)
      @serviceOptions       = new ServiceOptionsModel(@granuleAccessOptions)
      @isResetable          = ko.computed(@_computeIsResetable, this, deferEvaluation: true)
      @selectedVariables    = ko.observableArray([])
      @loadingServiceType   = ko.observable(false)
      @isCustomizable       = ko.observable(false)
      @editingAccessMethod  = ko.observable(false)
      @editingVariables     = ko.observable(false)
      @expectedAccessMethod = ko.computed(@_computeExpectedAccessMethod, this, deferEvaluation: true)
      @expectedUmmService   = ko.computed(@_computeExpectedUmmService, this, deferEvaluation: true)
      @isLoadingComplete    = ko.computed(@_computeIsLoadingComplete, this, deferEvaluation: true)

      # When the loadingServiceType is updated re-calculate the subsetting flags
      @loadingServiceType.subscribe(@_computeSubsettingFlags)

      # Update the variableSubsettingEnabled flag when we modify the selectedVariables
      @selectedVariables.subscribe =>
        @variableSubsettingEnabled(@selectedVariables().length > 0)

      # Subsetting flags for the collection cards
      @spatialSubsettingEnabled        = ko.observable(false)
      @variableSubsettingEnabled       = ko.observable(false)
      @transformationSubsettingEnabled = ko.observable(false)
      @reformattingSubsettingEnabled   = ko.observable(false)

      # Re-calculate the subsetting flags when changes are made to an ECHO form
      $(document).on 'echoforms:modelchange', @_computeSubsettingFlags

    _computeIsResetable: ->
      if @granuleAccessOptions().defaults?
        for method in @granuleAccessOptions().defaults.accessMethod
          return true if method.collection_id == @collection.id
      false

    dispose: ->
      colorPool.unuse(@meta.color) if colorPool.has(@meta.color)
      @collection.dispose()
      @serviceOptions.dispose()

    _computeIsLoadingComplete: ->
      return true if !@loadingServiceType() && @collection.total_size() && @collection.unit()
      false

    _loadGranuleAccessOptions: ->
      dataSource = @collection.granuleDatasource()
      unless dataSource
        @granuleAccessOptions(hits: 0, methods: [])
        return

      @loadingServiceType(true)

      console.log "Loading granule access options for #{@collection.id}"

      $(document).trigger('dataaccessevent', [@collection.id])
      success = (data) =>
        console.log "Finished loading access options for #{@collection.id}"

        @granuleAccessOptions(data)

        # Done loading
        @loadingServiceType(false)
      retry = => @_loadGranuleAccessOptions

      dataSource.loadAccessOptions(success, retry)

    # Based on the fact that we are only supporting three UMM Service types we
    # can infer which accessMethod the user *should* be choosing for a particular
    # collection, here we are setting that accessMethod for use within the
    # customization modals
    _computeExpectedAccessMethod: =>
      expectedMethod = null
      if @granuleAccessOptions()
        $.each @granuleAccessOptions().methods, (index, accessMethod) =>
          # Download is our default method so if it's found we'll set it here which
          # is fine because if a supported UMM Service records is found below it will
          # override it and return, preventing that value from being overridden
          expectedMethod = accessMethod if accessMethod.type == 'download'

          # For now we're using the first valid/supported UMM Service record found
          if accessMethod.umm_service?.umm?.Type in supportedServiceTypes
            expectedMethod = accessMethod

            # A non-false return statemet within jQuery's `.each` will
            # simply continue rather than return, so we need to set a variable
            # to null outside of the loop, set the value like we've done above
            # when the conditional is true, and return false which will exit
            # the loop
            return false

        # Select the expected method
        if @serviceOptions.accessMethod().length > 0
          @serviceOptions.accessMethod()[0].method(expectedMethod.name)

        # Determines if we should show or hide the `Customize` button on the collection card
        @isCustomizable(expectedMethod?.type in ['opendap', 'service', 'order'])

      expectedMethod

    # Retrieve the user selected UMM Service from the access method. In the
    # future this will be set by the user, but for now were just going to
    # use the first supported UMM Service record as we'll only be assigning
    # one UMM Service record to each collection.
    _computeExpectedUmmService: =>
      # If we've already determined the expectedAccessMethod we'll just use the
      # associated UMM Service record, the logic in this method is the same as determining
      # the expectedAccessMethod
      return @expectedAccessMethod().umm_service if @expectedAccessMethod()?

      expectedUmmService = null
      if @granuleAccessOptions()
        $.each @granuleAccessOptions().methods, (index, accessMethod) =>
          # For now we're using the first valid/supported UMM Service record found
          if accessMethod.umm_service?.umm?.Type in supportedServiceTypes
            expectedUmmService = accessMethod.umm_service

            # A non-false return statement within jQuery's `.each` will
            # simply continue rather than return, so we need to set a variable
            # to null outside of the loop, set the value like we've done above
            # when the conditional is true, and return false which will exit
            # the loop
            return false

      expectedUmmService

    launchEditModal: =>
      $('#' + @collection.id + '-edit-modal').modal()
      $('#' + @collection.id + '-edit-modal').on 'hidden.bs.modal', @onModalClose

    onModalClose: =>
      @editingAccessMethod(false)
      @editingVariables(false)

    triggerEditAccessMethod: =>
      @_resetModalScrollPosition()
      @editingAccessMethod(true)

    triggerEditVariables: =>
      @_resetModalScrollPosition()
      @editingVariables(true)

    _resetModalScrollPosition: =>
      $('#' + @collection.id + '-edit-modal .modal-body').animate({
        scrollTop: 0
      }, 0)

    showSpinner: (item, e) =>
      # This will likely need to change if we opt to support multiple access methods
      @serviceOptions?.accessMethod?()[0].showSpinner(item, e)
      @editingAccessMethod(false)
      true

    findSelectedVariable: (variable) =>
      selectedVariablePosition = @indexOfSelectedVariable(variable)

      return null if selectedVariablePosition == -1

      @selectedVariables()[selectedVariablePosition]

    indexOfSelectedVariable: (variable) =>
      for selectedVariable, index in @selectedVariables()
        if variable.meta()['concept-id'] == selectedVariable.meta()['concept-id']
          return index
      -1

    hasSelectedVariable: (variable) =>
      @indexOfSelectedVariable(variable) != -1

    hasSelectedVariables: =>
      @selectedVariables().length > 0

    fromJson: (jsonObj) ->
      @serviceOptions.fromJson(jsonObj.serviceOptions)

    setSelectedVariablesById: (variables) =>
      # Retrieve the stored selected variables by concept id and assign
      # them to the project collection
      VariablesModel.forIds variables, {}, (variables) =>
        @selectedVariables(variables)

    customizeButtonText: =>
      return 'Edit Customizations' if @spatialSubsettingEnabled() || @variableSubsettingEnabled() || @transformationSubsettingEnabled() || @reformattingSubsettingEnabled()

      'Customize'

    selectedAccessMethod: =>
      if @serviceOptions.accessMethod().length > 0
        return @serviceOptions.accessMethod()[0].method()

    selectedAccessMethodType: =>
      if @serviceOptions.accessMethod().length > 0
        return @serviceOptions.accessMethod()[0].methodType()

    # When a user makes a changes to an ECHO form the accessMethods model
    # is updated so we'll need to parse the updated model to check for the
    # new values
    _accessMethodModelXml: =>
      if @serviceOptions.accessMethod().length > 0
        if @serviceOptions.accessMethod()[0].rawModel
          # Capybara-webkit does not seem to be able to parse/find tag namespaces so before
          # parsing the XML we replace namespace colons with a hyphen
          $($.parseXML(@serviceOptions.accessMethod()[0].rawModel.replace(/ecs\:/g, 'ecs-')))

    _findWithinAccessMethodModel: (path) =>
      xml = @_accessMethodModelXml()
      xml.find(path).text() if xml

    _computeSubsettingFlags: =>
      @_computeSpatialSubsettingEnabled()
      @_computeVariableSubsettingEnabled()
      @_computeTransformationSubsettingEnabled()
      @_computeReformattingSubsettingEnabled()

    _computeSpatialSubsettingEnabled: =>
      if @expectedAccessMethod()?.type == 'opendap'
        # For OPeNDAP collections we just pass along the spatial search params
        serializedObj = @project.serialized()

        hasBoundingBox = serializedObj.bounding_box?.length > 0
        hasPolygon     = serializedObj.polygon?.length > 0

        # Return true if any of the spatial subsettings exist
        @spatialSubsettingEnabled(hasBoundingBox || hasPolygon)
      else if @expectedAccessMethod()?.type == 'service'
          is_spatially_subset = @_findWithinAccessMethodModel('ecs-spatial_subset_flag')

          @spatialSubsettingEnabled(is_spatially_subset == "true")
      else
        @spatialSubsettingEnabled(false)

    _computeVariableSubsettingEnabled: =>
      if @expectedAccessMethod()?.type == 'opendap'
        # OPeNDAP collections use a different means of calculating this value
      else if @expectedAccessMethod()?.type == 'service'
        formXml = @_accessMethodModelXml()

        if formXml
          # We don't know what the root is that would live within `SUBSET_DATA_LAYERS` but
          # when a value is selected it will live within `dataset` so we can check to see
          # if that element exists, if it does a value has been selected in the tree view
          has_variable_subsets = formXml.find('ecs-SUBSET_DATA_LAYERS').find('ecs-dataset').text()

          @variableSubsettingEnabled(has_variable_subsets.length > 0)
        else
          @variableSubsettingEnabled(false)
      else
        @variableSubsettingEnabled(false)

    _computeTransformationSubsettingEnabled: =>
      if @expectedAccessMethod()?.type == 'opendap'
        # OPeNDAP collections use a different means of calculating this value
      else if @expectedAccessMethod()?.type == 'service'
          has_transformation_subsets = $.trim(@_findWithinAccessMethodModel('ecs-PROJECTION'))

          # Check for the existense, a blank value, or the ESI equivelant of blank which is `&`
          @transformationSubsettingEnabled(has_transformation_subsets.length > 0 && has_transformation_subsets != '&')
      else
        @transformationSubsettingEnabled(false)

    _computeReformattingSubsettingEnabled: =>
      if @expectedAccessMethod()?.type == 'opendap'
        # OPeNDAP collections use a different means of calculating this value
      else if @expectedAccessMethod()?.type == 'service'
          has_reformatting_subsets = $.trim(@_findWithinAccessMethodModel('ecs-FORMAT'))

          # Check for the existense, a blank value, or the ESI equivelant of blank which is `&`
          @reformattingSubsettingEnabled(has_reformatting_subsets.length > 0 && has_reformatting_subsets != '&')
      else
        @reformattingSubsettingEnabled(false)

    serialize: ->
      options = @serviceOptions.serialize()
      $(document).trigger('dataaccessevent', [@collection.id, options])

      form_hashes = []
      for method in @granuleAccessOptions().methods || []
        for accessMethod in options.accessMethod
          form_hash = {}
          if ((method.id == null || method.id == undefined ) || accessMethod.id == method.id) && accessMethod.type == method.type
            if method.id?
              form_hash['id'] = method.id
            else
              form_hash['id'] = accessMethod.type
            form_hash['form_hash'] = method.form_hash
            form_hashes.push form_hash

      id: @collection.id
      params: param(@collection.granuleDatasource()?.toQueryParams() ? @collection.query.globalParams())
      serviceOptions: options
      variables: @selectedVariables().map((v) => v.meta()['concept-id']).join('!')
      selectedService: @expectedUmmService(),
      form_hashes: form_hashes

  class Project
    constructor: (@query) ->
      @_collectionIds = ko.observableArray()
      @_collectionsById = {}

      @id = ko.observable(null)
      @collections = ko.computed(read: @getCollections, write: @setCollections, owner: this)
      @focusedProjectCollection = ko.observable(null)
      @focus = ko.computed(read: @_readFocus, write: @_writeFocus, owner: this)
      @searchGranulesCollection = ko.observable(null)
      @accessCollections = ko.computed(read: @_computeAccessCollections, owner: this, deferEvaluation: true)
      @allReadyToDownload = ko.computed(@_computeAllReadyToDownload, this, deferEvaluation: true)
      @visibleCollections = ko.computed(read: @_computeVisibleCollections, owner: this, deferEvaluation: true)
      @isLoadingComplete = ko.computed(read: @_computeIsLoadingComplete, this, deferEvaluation: true)

      @serialized = ko.computed
        read: @_toQuery
        write: @_fromQuery
        owner: this
        deferEvaluation: true
      @_pending = ko.observable(null)

    _computeIsLoadingComplete: ->
      if @collections?().length > 0
        for collection in @collections()
          if !collection.isLoadingComplete()
            return false
        true

    _computeAllReadyToDownload: ->
      return false if !@accessCollections().length
      return false for ds in @accessCollections() when !ds.serviceOptions.readyToDownload()
      true

    _computeAccessCollections: ->
      focused = @focusedProjectCollection()
      if focused
        [focused]
      else
        @_collectionsById[id] for id in @_collectionIds()

    _readFocus: -> @focusedProjectCollection()
    _writeFocus: (collection) =>
      observable = @focusedProjectCollection
      current = observable()
      unless current?.collection == collection
        current?.dispose()
        if collection?
          projectCollection = new ProjectCollection(this, collection)
        observable(projectCollection)

    getCollections: ->
      @_collectionsById[id] for id in @_collectionIds()

    exceedCollectionLimit: ->
      for projectCollection in @getCollections()
        return true if projectCollection.collection.isMaxOrderSizeReached()
      false

    setCollections: (collections) =>
      collectionIds = []
      collectionsById = {}
      for ds, i in collections
        id = ds.id
        collectionIds.push(id)
        collectionsById[id] = @_collectionsById[id] ? new ProjectCollection(this, ds)
      @_collectionsById = collectionsById
      @_collectionIds(collectionIds)
      null

    _computeVisibleCollections: ->
      collections = (projectCollection.collection for projectCollection in @collections() when projectCollection.collection.visible())

      focus = @focus()?.collection
      if focus && focus.visible() && collections.indexOf(focus) == -1
        collections.push(focus)

      # Other visible collections not controlled by the project
      for collection in Collection.visible()
        collections.push(collection) if collections.indexOf(collection) == -1
      collections

    backToSearch: =>
      projectId = deparam(urlUtil.realQuery()).projectId
      if projectId
        path = "/search?projectId=#{projectId}"
      else
        path = '/search?' + urlUtil.currentQuery()

      $(window).trigger('edsc.save_workspace')
      window.location.href = urlUtil.fullPath(path)

    # This seems like a UI concern, but really it's something that spans several
    # views and something we may eventually want to persist with the project or
    # allow the user to alter.
    colorForCollection: (collection) ->
      return null unless @hasCollection(collection)

      @_collectionsById[collection.id].meta.color

    isEmpty: () ->
      @_collectionIds.isEmpty()

    addCollection: (collection, callback) =>
      id = collection.id

      # If a collection already exists with this id, no need to proceed
      if !@_collectionsById[id]
        # If the focused collection is the collection being added, don't
        # instantiate a new object
        if @focus()?.collection?.id == id
          @_collectionsById[id] = @focus()
        else
          @_collectionsById[id] = new ProjectCollection(this, collection)

        @_collectionIds.remove(id)
        @_collectionIds.push(id)

      callback() if callback

    removeCollection: (collection) =>
      id = collection.id
      @_collectionsById[id]?.dispose()
      delete @_collectionsById[id]
      @_collectionIds.remove(id)
      null

    hasCollection: (other) =>
      @_collectionIds.indexOf(other.id) != -1

    isSearchingGranules: (collection) =>
      @searchGranulesCollection() == collection

    fromJson: (jsonObj) ->
      collections = null
      if jsonObj.collections?
        collections = {}
        collections[ds.id] = ds for ds in jsonObj.collections
      @_pendingAccess = collections
      @serialized(deparam(jsonObj.query))

    serialize: (collections=@collections) ->
      collections = (ds.serialize() for ds in @accessCollections())
      {query: param(@serialized()), collections: collections, source: urlUtil.realQuery()}

    # Retreive a ProjectCollection object for the collection matching the provided concept-id
    getProjectCollection: (id) ->
      focus = @focusedProjectCollection()
      if focus?.collection.id == id
        focus
      else
        @_collectionsById[id]

    _toQuery: ->
      return @_pending() if @_pending()?
      result = $.extend({}, @query.serialize())
      collections = [@focus()?.collection].concat(projectCollection.collection for projectCollection in @collections())
      ids = (ds?.id ? '' for ds in collections)
      if collections.length > 1 || collections[0]
        queries = [{}]
        result.p = ids.join('!')
        start = 1
        start = 0 if @focus()?.collection && !@hasCollection(@focus()?.collection)
        for collection, i in collections[start...]
          datasource = collection.granuleDatasource()
          projectCollection = @getProjectCollection(collection.id)
          query = {}

          # Only set the variables if there are any selected
          if projectCollection.hasSelectedVariables()
            query['variables'] = projectCollection.selectedVariables().map((v) => v.meta()['concept-id']).join('!')

          if datasource?
            $.extend(query, datasource.toBookmarkParams())

            queries[i + start] = {} if Object.keys(query).length == 0
            query.v = 't' if (i + start) != 0 && collection.visible()
            # Avoid inserting an empty map
            for own k, v of query
              queries[i + start] = query
              break

        for q, index in queries
          queries[index] = {} if q == undefined
        result.pg = queries if queries.length > 0

      result

    _fromQuery: (value) ->
      @query.fromJson(value)

      collectionIdStr = value.p
      if collectionIdStr
        if collectionIdStr != @_collectionIds().join('!')
          collectionIds = collectionIdStr.split('!')
          focused = !!collectionIds[0]
          collectionIds.shift() unless focused
          @_pending(value)
          value.pg ?= []
          value.pg[0] ?= {}

          # If the focused collection is also in the project copy its customizations to
          # the focused position, 0
          if focused
            for id, i in collectionIds
              if i > 0 && id == collectionIds[0]
                value.pg[0] = value.pg[i]

          CollectionsModel.forIds collectionIds, @query, (collections) =>
            @_pending(null)
            pending = @_pendingAccess ? {}

            # Default where we begin examining collections to 1 as position 0 is
            # reservered for the focused collection
            offset = 1

            # Update the offset if there is a focused collection
            offset = 0 if focused

            # `pg` holds the collection specific customizations that have been made
            queries = value["pg"] ? []

            # Iterate through the collections returned from `forIds` based on
            # the collection ids in the URL
            for collection, i in collections
              query = queries[i + offset]

              if i == 0 && focused
                # Set the focused collection if one exists
                @focus(collection)
              else
                # If this collection is the same as the focused collection
                # addCollection will look it up and use it to avoid redundant objects
                @addCollection(collection)

              # If customizations have been made to this collection they will exist in
              # the query object defined above
              if query?
                if query.variables
                  variables = query.variables.split('!')

                  # Retrieve the stored selected variables by concept id and assign
                  # them to the project collection
                  @getProjectCollection(collection.id).setSelectedVariablesById(variables)

                if collection.granuleDatasource()?
                  collection.granuleDatasource().fromBookmarkParams(query, value)
                  collection.visible(true) if query.v == 't'

              collection.dispose() # forIds ends up incrementing reference count
              @getProjectCollection(collection.id).fromJson(pending[collection.id]) if pending[collection.id]
            @_pendingAccess = null
      else
        @collections([])

  exports = Project
