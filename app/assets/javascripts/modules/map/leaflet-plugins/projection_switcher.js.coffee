ns = window.edsc.map.L

ns.ProjectionSwitcher = do (L) ->
  DomUtil = L.DomUtil

  ProjectionSwitcher = L.Control.extend
    options:
      position: 'topright'

    initialize: (options={}) ->
      L.Control.prototype.initialize.call(this, options);

    onAdd: (map) ->
      @map = map
      $root = $('<div class="projection-switcher leaflet-bar">
                   <a href="#arctic" class="projection-switcher-arctic" title="North Polar Stereographic"></a>
                   <a href="#geo" class="leaflet-disabled projection-switcher-geo" title="Geographic (Equirectangular)"></a>
                   <a href="#antarctic" class="projection-switcher-antarctic" title="South Polar Stereographic"></a>
                 </div>')

      @$root = $root
      $container = $(map.getContainer())
      edscMap = $container.data('map')

      self = this

      $root.find('a').on 'click dblclick', (e) ->
        e.preventDefault()
        e.stopPropagation()
        newProjection = this.href.split('#')[1]
        edscMap.setProjection(newProjection, true)

      map.on 'projectionchange', (e) ->
        self.setProjection e.projection

      $root[0]

    onRemove: (map) ->


    setProjection: (proj) ->
      $root = @$root
      $link = @$root.children("[href=\\##{proj}]")

      $link.siblings().removeClass('leaflet-disabled')
      $link.addClass('leaflet-disabled')

  exports = ProjectionSwitcher
