ns = @edsc.map.L

ns.GibsTileLayer = do (L,
                       gibsUrl = @edsc.config.gibsUrl,
                       dateUtil = window.edsc.util.date,
                       config = @edsc.config
                       ) ->

  yesterday = new Date(config.present())
  yesterday.setDate(yesterday.getDate() - 1)

  class GibsTileLayer extends L.TileLayer
    validForProjection: (proj) ->
      @options.endpoint == proj

    onAdd: (map) ->
      if @options.syncTime
        @options.time = dateUtil.isoUtcDateString(map._time ? yesterday)
      else
        @options.time = ''
      super()
      map.on 'edsc.timechange', @_onTimeChange

    onRemove: (map) ->
      super(map)
      map.off 'edsc.timechange', @_onTimeChange

    _onTimeChange: (e) =>
      if @options.syncTime
        date = e.time ? yesterday
        @updateOptions(time: dateUtil.isoUtcDateString(date))

    updateOptions: (options={}) ->
      @options = L.extend({}, @options, options)
      @redraw()

  exports = GibsTileLayer
