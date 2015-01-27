# Info for tracking query times, EDSC-595, https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings
# Info for tracking button/link clicks, EDSC-596, https://developers.google.com/analytics/devguides/collection/analyticsjs/events , possibly use this for tracking data access options, EDSC-599



this.edsc.util.metrics = do ->

  createPageView: (path, state) ->
    if ga?
      console.log "Path: #{path}"
      console.log "State: #{JSON.stringify(state)}"

      # set custom dimensions to track other stuff
      # Dimension 1, keyword search
      ga('set', 'dimension1', if state.free_text? then state.free_text.toLowerCase() else null)

      # Dimension 2, spatial type
      spatial = null
      spatial = 'Bounding Box' if state.bounding_box?
      spatial = 'Polygon' if state.polygon?
      spatial = 'Point' if state.point?
      ga('set', 'dimension2', spatial)

      # Dimension 3, temporal type
      temporal = null
      if state.temporal?
        if state.temporal.split(',').length > 2
          temporal = 'Recurring Temporal'
        else
          temporal = 'Standard Temporal'
      ga('set', 'dimension3', temporal)

      # Dimension 4, datasets viewed
      # Dimension 5, datasets added to project
      d4 = null
      d5 = null
      if state.p?
        datasetIds = state.p.split('!')
        for id, index in datasetIds
          if id.length > 0
            if index == 0
              d4 = id
            else
              d5 = id
      ga('set', 'dimension4', d4)
      ga('set', 'dimension5', d5)

      # Dimension 6, Search facets
      facets = []
      facets.push("Features/#{state.features.join('Features/')}") if state.features?
      facets.push("Archive Center/#{state.archive_center.join('Archive Center/')}") if state.archive_center?
      facets.push("Project/#{state.project.join('Project/')}") if state.project?
      facets.push("Platform/#{state.platform.join('Platform/')}") if state.platform?
      facets.push("Instrument/#{state.instrument.join('Instrument/')}") if state.instrument?
      facets.push("Sensor/#{state.sensor.join('Sensor/')}") if state.sensor?
      facets.push("2D Coordinate Name/#{state.two_d_coordinate_system_name.join('2D Coordinate Name/')}") if state.two_d_coordinate_system_name?
      facets.push("Processing Level/#{state.sensor.join('Processing Level/')}") if state.sensor?
      if state.science_keywords?
        facets.push("Category Keyword/#{state.science_keywords[0].category.join('Category Keyword/')}") if state.science_keywords[0].category?
        facets.push("Topic Keyword/#{state.science_keywords[0].topic.join('Topic Keyword/')}") if state.science_keywords[0].topic?
        facets.push("Term Keyword/#{state.science_keywords[0].term.join('Term Keyword/')}") if state.science_keywords[0].term?
        facets.push("Variable Level 1 Keyword/#{state.variable_level_1.join('Variable Level 1 Keyword/')}") if state.variable_level_1?
        facets.push("Variable Level 2 Keyword/#{state.variable_level_2.join('Variable Level 2 Keyword/')}") if state.variable_level_2?
        facets.push("Variable Level 3 Keyword/#{state.variable_level_3.join('Variable Level 3 Keyword/')}") if state.variable_level_3?
        facets.push("Detailed Variable Keyword/#{state.detailed_variable.join('Detailed Variable Keyword/')}") if state.detailed_variable?
      ga('set', 'dimension6', if facets.length > 0 then facets.join(' ') + ' ' else null)


      # Send the page view
      ga('send', 'pageview', path)
