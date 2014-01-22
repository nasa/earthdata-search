ns = @edsc.models.ui

ns.Temporal = do (ko) ->

  class Temporal
    constructor:  (@query) ->
      @start = ko.observable("")
      @stop = ko.observable("")
      @years = ko.observable("")

    _formatDate: (date) ->
      date.replace("T", " ").replace("Z", "") if date

    selectNone: =>
        @start("")
        @stop("")
        @years("")

    setTemporal: (type) =>
      query = @query
      if query.temporal()
        if type == "recurring"
          recurring = query.temporal_recurring()
          @start(@_formatDate(recurring[0].substring(5)))
          @stop(@_formatDate(recurring[1].substring(5)))
          @years(recurring[0].substring(0,4) + " - " + recurring[1].substring(0,4))
        else if type == "range"
          @start(@_formatDate(query.temporal_range_start()))
          @stop(@_formatDate(query.temporal_range_stop()))
          @years("")
      else
        @selectNone()

  exports = Temporal