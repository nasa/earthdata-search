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


      # Send the page view
      ga('send', 'pageview', path)
