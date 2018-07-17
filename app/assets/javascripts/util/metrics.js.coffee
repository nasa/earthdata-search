this.edsc.util.metrics = do ->

  createPageView: (path, state) ->
    if ga?
      # Set custom dimensions to track other stuff
      # Dimensions 1-10 are reserved for dimensions designated by the global ESDIS Google Tag Manager container

      # Dimension 11, keyword search
      ga('set', 'dimension11', if state.free_text? then state.free_text.toLowerCase() else null)

      # Dimension 12, spatial type
      spatial = null
      spatial = 'Bounding Box' if state.bounding_box?
      spatial = 'Polygon' if state.polygon?
      spatial = 'Point' if state.point?
      ga('set', 'dimension12', spatial)

      # Dimension 13, temporal type
      temporal = null
      if state.temporal?
        if state.temporal.split(',').length > 2
          temporal = 'Recurring Temporal'
        else
          temporal = 'Standard Temporal'
      ga('set', 'dimension13', temporal)

      # Dimension 14, collections viewed
      # Dimension 15, collections added to project
      d14 = null
      d15 = null
      if state.p?
        collectionIds = state.p.split('!')
        for id, index in collectionIds
          if id.length > 0
            if index == 0
              d14 = id
            else
              d15 = id
      ga('set', 'dimension14', d14)
      ga('set', 'dimension15', d15)

      # Dimension 16, Search facets
      facet_names = ['category', 'features', 'data_center', 'project', 'platform', 'instrument', 'processing_level_id']
      facets = []
      for name in facet_names when state[name]?
        facets.push("#{name}/#{value}") for value in state[name]

      if state.science_keywords?
        keyword_names = ['topic', 'term', 'variable_level_1', 'variable_level_2', 'variable_level_3', 'detailed_variable']
        for name in keyword_names when state.science_keywords[0][name]?
          facets.push("#{name}/#{value}") for value in state.science_keywords[0][name]

      ga('set', 'dimension16', if facets.length > 0 then facets.join(' ') + ' ' else null)


      # Send the page view
      ga('send', 'pageview', path)

  createDataAccessEvent: (collection, options) ->
    if ga?
      # Dimension 17, Collection Accessed
      ga('set', 'dimension17', collection)

      if options? # If options exist, it is completing data access
        # Dimension 18, Access Options (Download, FTP_Pull, etc.)
        for accessMethod in options.accessMethod
          ga('set', 'dimension18', accessMethod.method)
          opts = accessMethod.options
          subtype = accessMethod.type
          subtype = 'opendap' if accessMethod.subset?.parameters
          subtype = 'esi' if subtype == 'service'
          ga('set', 'dimension19', subtype)

          ga('send', 'event', 'Data Access', 'Completion', 'Data Access Completion', 1)
      else
        ga('send', 'event', 'Data Access', 'Initiation', 'Data Access Initiation', 1)

      # Ensure dimensions don't get set for any other tracking
      ga('set', 'dimension17', null)
      ga('set', 'dimension18', null)

  createEvent: (e) ->
    if ga?
      title = e.currentTarget.title
      ga('send', 'event', 'button', 'click', title) if title?

  createTimelineEvent: (label) ->
    ga('send', 'event', 'button', 'click', "Timeline #{label}") if ga?

  createMapEvent: (label) ->
    ga('send', 'event', 'button', 'click', "Map #{label}") if ga?

  createTiming: (path, time) ->
    ga('send', 'timing', 'ajax', path, time) if ga?

  createMapEdit: (preBounds, postBounds, type) ->
    if ga? && preBounds?.length == postBounds?.length
      distanceSum = 0
      for p0, i in preBounds
        p1 = postBounds[i]
        distanceSum += p0.distanceTo(p1)
      ga('send', 'event', 'Spatial Edit', type, '', Math.round(distanceSum))
