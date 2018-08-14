this.edsc.util.metrics = do ->

  createPageView: (path, state) ->
    if dataLayer?
      # Set custom dimensions to track other stuff
      # Dimensions 1-10 are reserved for dimensions designated by the global ESDIS Google Tag Manager container

      # Dimension 11, keyword search
      dimension11 = if state.free_text? then state.free_text.toLowerCase() else null

      # Dimension 12, spatial type
      spatial = null
      spatial = 'Bounding Box' if state.bounding_box?
      spatial = 'Polygon' if state.polygon?
      spatial = 'Point' if state.point?

      dimension12 = spatial

      # Dimension 13, temporal type
      temporal = null
      if state.temporal?
        if state.temporal.split(',').length > 2
          temporal = 'Recurring Temporal'
        else
          temporal = 'Standard Temporal'
      dimension13 = temporal

      # Dimension 14, collections viewed
      # Dimension 15, collections added to project
      collectionsViewed = null
      collectionsAdded = null
      if state.p?
        collectionIds = state.p.split('!')
        for id, index in collectionIds
          if id.length > 0
            if index == 0
              collectionsViewed = id
            else
              collectionsAdded = id

      dimension14 = collectionsViewed
      dimension15 = collectionsAdded

      # Dimension 16, Search facets
      facet_names = ['category', 'features', 'data_center', 'project', 'platform', 'instrument', 'processing_level_id']
      facets = []
      for name in facet_names when state[name]?
        facets.push("#{name}/#{value}") for value in state[name]

      if state.science_keywords?
        keyword_names = ['topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3', 'detailed_variable']
        for name in keyword_names when state.science_keywords[0][name]?
          facets.push("#{name}/#{value}") for value in state.science_keywords[0][name]

      dimension16 = if facets.length > 0 then facets.join(' ') + ' ' else null

      dataLayer.push({
        'event': 'virtualPageView',
        'dimension11': dimension11, # Keyword Search
        'dimension12': dimension12, # Spatial
        'dimension13': dimension13, # Temporal
        'dimension14': dimension14, # Collections Viewed
        'dimension15': dimension15, # Collections Added
        'dimension16': dimension16  # Search Facet
      })

  createDataAccessEvent: (collection, options) ->
    if dataLayer?
      # Dimension 17, Collection Accessed
      dimension17 = collection

      # If options exist, it is completing data access
      if options?

        # Dimension 18, Access Options (Download, FTP_Pull, etc.)
        # Dimension 19, Access Type (single_granule, order, esi, etc.)
        for accessMethod in options.accessMethod
          opts = accessMethod.options
          subtype = accessMethod.type
          subtype = 'opendap' if accessMethod.subset?.parameters
          subtype = 'esi' if subtype == 'service'

          dimension18 = accessMethod.method
          dimension19 = subtype

          dataLayer.push({
            'event': 'dataAccess',
            'dimension17': dimension17, # Collection
            'dimension18': dimension18, # Access Options
            'dimension19': dimension19, # Subtype
            'dataAccessCategory': 'Data Access',
            'dataAccessAction': 'Completion',
            'dataAccessLabel': 'Data Access Completion',
            'dataAccessValue': 1
          })

      else
        dataLayer.push({
          'event': 'dataAccess',
          'dimension17': dimension17, # Collection
          'dimension18': null, # Access Options
          'dimension19': null, # Subtype
          'dataAccessCategory': 'Data Access',
          'dataAccessAction': 'Initiation',
          'dataAccessLabel': 'Data Access Initiation',
          'dataAccessValue': 1
        })

      dataLayer.push({
        'dimension17': null, # Keyword Search
        'dimension18': null, # Spatial
        'dimension19': null, # Subtype
      })

  createDefaultClickEvent: (e) ->
    if dataLayer?
      title = e.currentTarget.title

      # TODO: The variables passed along here should be reviewed. We can probably
      # be a little more informative as to what is being clicked. For example,
      # no distiction is made as to the element type, and we get no informative
      # value if a title attribute is not set.
      dataLayer.push({
        'event': 'defaultClick',
        'defaultClickCategory': 'button',
        'defaultClickAction': 'click',
        'defaultClickLabel': title
      })

  createTimelineEvent: (label) ->
    if dataLayer?
      dataLayer.push({
        'event': 'timeline',
        'timelineEventCategory': 'button',
        'timelineEventAction': 'click',
        'timelineEventLabel': "Timeline #{label}"
      })


  createMapEvent: (label) ->
    if dataLayer?
      dataLayer.push({
        'event': 'map',
        'mapEventCategory': 'button',
        'mapEventAction': 'click',
        'mapEventLabel': "Map #{label}"
      })

  createTiming: (path, time) ->
    if dataLayer?
      dataLayer.push({
        'event': 'timing',
        'timingEventCategory': 'ajax',
        'timingEventVar': path,
        'timingEventValue': time
      })

  createMapEdit: (preBounds, postBounds, type) ->
    if dataLayer? && preBounds?.length == postBounds?.length
      distanceSum = 0
      for p0, i in preBounds
        p1 = postBounds[i]
        distanceSum += p0.distanceTo(p1)

      dataLayer.push({
        'event': 'spatialEdit',
        'spatialEditEventCategory': 'Spatial Edit',
        'spatialEditEventAction': type,
        'spatialEditEventLabel': '',
        'spatialEditEventValue': Math.round(distanceSum),
      })
