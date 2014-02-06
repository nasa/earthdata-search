ns = window.edsc.map.L

ns.SedacTileLayer = do (L, ProjectionSwitchingLayer = ns.ProjectionSwitchingLayer) ->
  sedacUrl = "http://sedac.ciesin.columbia.edu/geoserver/ows"

  # Layer class for interacting with SEDAC data
  class SedacTileLayer extends ProjectionSwitchingLayer
    defaultOptions:
      format: 'image/png'
      transparent: true

    _buildLayerWithOptions: (newOptions) ->
      L.extend(@options.wmsParams, newOptions)
      new L.TileLayer.WMS(sedacUrl, @options.wmsParams)

  exports = SedacTileLayer
