ns = @edsc.models.data

# FIXME: Get rid of dependency on jQuery, ui, and page model
ns.Query = do (ko, date=@edsc.util.date, evilJQuery=$, evilPageModels=@edsc.models.page) ->

  current_year = new Date().getFullYear()

  class Query
    constructor: ->
      @keywords = ko.observable("")
      @spatial = ko.observable("")
      @temporal = ko.observable("")

      @temporal_range_start = ko.observable("")
      @temporal_range_stop = ko.observable("")
      @temporal_recurring_start = ko.observable("")
      @temporal_recurring_stop = ko.observable("")
      @temporal_recurring_year_range = ko.observable("")

      @temporal_range = ko.computed =>
        result = []

        start = date.queryDateString(@temporal_range_start())
        result.push(start) if start?

        stop = date.queryDateString(@temporal_range_stop())
        result.push(stop) if stop?

        if result.length > 0
          result
        else
          null

      @temporal_recurring = ko.computed =>
        years = @temporal_recurring_year_range().split(" - ")
        start = date.queryDateString(years[0] + "-" + @temporal_recurring_start()) if @temporal_recurring_start()
        stop = date.queryDateString(years[1] + "-" + @temporal_recurring_stop()) if @temporal_recurring_stop()

        start_day = date.findDayOfYear(new Date(start))
        stop_day = date.findDayOfYear(new Date(stop))

        if start and stop and start_day and stop_day
          [start,stop,start_day,stop_day]
        else
          null

      @facets = ko.observableArray()
      @placename = ko.observable("")

      @day_night_flag_options = ["Anytime","Day only","Night only","Both day and night"]
      @day_night_flag = ko.observable("")

      @params = ko.computed(@_computeParams)

    clearFilters: =>
      @keywords('')
      @spatial('')
      evilPageModels.current.ui.spatialType.selectNone()
      evilPageModels.current.ui.temporal.selectNone()
      @temporal(null)
      @temporal_range_start("")
      @temporal_range_stop("")
      @temporal_recurring_start("")
      @temporal_recurring_stop("")
      @temporal_recurring_year_range('1960 - ' + current_year)
      evilJQuery('.temporal-recurring-year-range').slider('setValue', [1960, current_year])
      @placename('')
      @facets.removeAll()
      @day_night_flag("")

    toggleQueryDatasetSpatial: (dataset) =>
      constraint = dataset.spatial_constraint()
      spatial = @spatial()
      constraint = "" if constraint == spatial
      @spatial(constraint)
      false

    canQueryDatasetSpatial: (dataset) =>
      spatial = @spatial()
      constraint = dataset.spatial_constraint()
      constraint? && (!spatial || spatial == constraint)

    _computeParams: =>
      params = {}

      keywords = @keywords()
      params.keyword = keywords.trim() if keywords?.trim().length > 0

      spatial = @spatial()
      params.spatial = spatial if spatial?.length > 0

      temporal = @temporal()
      params.temporal = temporal.join(',') if temporal?.length > 0

      for facet in @facets()
        param = facet.param
        params[param] ||= []
        params[param].push(facet.term)

      placename = @placename()
      params.placename = placename if placename?.length > 0

      day_night_flag = @day_night_flag()
      params.day_night_flag = day_night_flag if day_night_flag?.length > 0

      params.page_size = 20

      params

    switchTemporal: (type) =>
      switch type
        when "range"
          range = @temporal_range()
          @temporal(range)
        when "recurring"
          recurring = @temporal_recurring()
          @temporal(recurring)

      evilPageModels.current.ui.temporal.setTemporal(type)

    clearTemporal: (button) =>
      type = "range"
      switch button
        when "range"
          @temporal_range_start("")
          @temporal_range_stop("")
        when "recurring"
          type = "recurring"
          @temporal_recurring_start("")
          @temporal_recurring_stop("")
          @temporal_recurring_year_range('1960 - ' + current_year)
          evilJQuery('.temporal-recurring-year-range').slider('setValue', [1960, current_year])
        when "range-start"
          @temporal_range_start("")
        when "range-stop"
          @temporal_range_stop("")
        when "recurring-start"
          type = "recurring"
          @temporal_recurring_start("")
        when "recurring-stop"
          type = "recurring"
          @temporal_recurring_stop("")

      @switchTemporal(type)

  exports = Query