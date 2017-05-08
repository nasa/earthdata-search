#= require proj4
#= require leaflet-0.7/leaflet-src
#= require modules/map/geoutil
#= require modules/map/leaflet-plugins/proj
#= require modules/map/leaflet-plugins/interpolation

do (L, $=jQuery, projectPath=@edsc.map.L.interpolation.projectPath, Proj=@edsc.map.L.Proj) ->
  class BoundingBox extends  $.echoforms.controls.Grouping
    @selector="group[id*='NWESBoundingBox']"

    constructor: (args...) ->
      @map_initialized = false
      @map
      @bbox_shape
      super(args...)

    showOnMap: ->
      unless @map_initialized
        @el.append("<div class='bbox_map' style='width: 100%; height: 300px'/>")
        @map = L.map(
          @el.find('div.bbox_map')[0],
          center: [0,0],
          zoom: 3,
          maxBounds: [
            [-120, -220],
            [120, 220]
          ]
        )
        template =
          "//map1{s}.vis.earthdata.nasa.gov/wmts-webmerc/" +
            "{layer}/default/{tileMatrixSet}/{z}/{y}/{x}.jpg";
        L.tileLayer(template, {
            layer: "BlueMarble_NextGeneration",
            tileMatrixSet: "GoogleMapsCompatible_Level8",
            maxZoom: 8,
            minZoom: 1,
            tileSize: 256,
            subdomains: "abc",
            noWrap: true,
            continuousWorld: true,
  # Prevent Leaflet from retrieving non-existent tiles on the
  # borders.
            bounds: [
              [-85.0511287776, -179.999999975],
              [85.0511287776, 179.999999975]
            ],
            attribution: "<a href='https://wiki.earthdata.nasa.gov/display/GIBS'>NASA EOSDIS GIBS</a>"
          }
        ).addTo(@map)
        @map_initialized=true

      #Get the bounding box coordinates
      north=parseInt(@el.find('div.bbox_north input').val())
      west=parseInt(@el.find('div.bbox_west input').val())
      east=parseInt(@el.find('div.bbox_east input').val())
      south=parseInt(@el.find('div.bbox_south input').val())

      #Make map visible and render the bounding box polygon.
      @el.find('.bbox_map').css('display','')
      @map.removeLayer(@bbox_shape) if @bbox_shape?
      @bbox_shape = L.polygon([
        [north, west],
        [north, east],
        [south, east],
        [south, west]
      ]);
      @bbox_shape.addTo(@map);
      @map.fitBounds(@bbox_shape.getBounds())

      #Change 'display' button to 'refresh' and make the 'hide' button visible
#      @el.find('.show_update_map').button('option','label','Refresh Map').button(icons:{primary:'ui-icon-refresh'})
#      @el.find('.hide_map').css('display', '')
#      @el.find('.hide_map').button(icons:{primary:'ui-icon-close'}).click =>
#        @el.find('.bbox_map').css('display','none')
#        @el.find('.show_update_map').button('option','label', 'Display Box On Map').button(icons:{primary:'ui-icon-pin-s'})
#        @el.find('.hide_map').css('display','none')

    buildDom: ->
      result = super()

      #Display text input boxes and an intuitive way
      children = result.children('.echoforms-children')
      children.find('>div').addClass('bbox_container')
      children.find('input[type="text"]').addClass('coordinate_input')
      children.find('> div:nth-child(1)').addClass('bbox_north')
      children.find('> div:nth-child(2)').addClass('bbox_west')
      children.find('> div:nth-child(3)').addClass('bbox_east')
      children.find('> div:nth-child(4)').addClass('bbox_south')
      children.find('> div.echoforms-help').css('float','left')
      @showOnMap()

      #Set up buttons for map display
#      children.append("<a class='show_update_map'/a>")
#      children.append("<a class='hide_map' style='display: none'>Hide Map</a>")
#      children.find('.show_update_map').button(icons:{primary:'ui-icon-pin-s'}).button('option','label','Display Box On Map').click =>
#        @showOnMap()

      result

  class XYBoxSubsetter extends $.echoforms.controls.Grouping
    @selector: 'group[id=XYBox]'

    buildDom: ->
      result = super()

      values = @_xyBoxValuesFromQuery()
      if values.length > 0
        @_setValuesToXyBox()

        @subsetOption = $('
          <div class="echoforms-control echoforms-typed-control"
            <div class="echoforms-elements">
              <label><input type="checkbox" checked> Subset around my spatial search area</label>
            </div>
          </div>')

        $checkbox = @subsetOption.find('input')
        $checkbox.on 'click change', (e) =>
          @_setValuesToXyBox($checkbox.is(':checked'))

        result.children('.echoforms-children').prepend(@subsetOption)

      # NSIDCs forms set the projection dropdown to be irrelevant despite it being used,
      # I think as a hack for Reverb / WIST's Jaz panel.
      @controls[0].relevantExpr = null
      @controls[0].relevant(true)
      result

    loadFromModel: ->
      $checkbox = @el.find('input[type="checkbox"]')
      if $checkbox.is(':checked')
        @_setValuesToXyBox(true, false)
      else
        super()

    _setValuesToXyBox: (readonly=true, events=true) ->
      values = @_xyBoxValuesFromQuery()
      controls = @controls

      for value, i in values
        control = controls[i]
        control.readonlyExpr = null
        control.inputs().val(value)
        control.inputs().change() if events
        control.readonly(readonly)


    _xyBoxValuesFromQuery: ->
      return @_xyBoxValues if @_xyBoxValues?

      spatial = edsc.page.query.spatial()
      return @_xyBoxValues = [] unless spatial? && spatial.length > 0

      [type, spatial...] = spatial.split(':')
      spatial = (pt.split(',').reverse().map((c) -> parseFloat(c)) for pt in spatial)
      latlngs = (L.latLng(p) for p in spatial)

      llbounds = L.latLngBounds(latlngs)

      # Figure out which hemisphere we're in.  If the search area is near the equator,
      # neither projection works, so we bail
      hemisphere = null
      if llbounds.getSouth() > 20
        hemisphere = 0
      else if llbounds.getNorth() < -20
        hemisphere = 1
      else
        return @_xyBoxValues = []

      # Since we're in a polar projection, we need to account for all 4 corners of bounding boxes
      interpolationStrategy = 'geodetic'
      if type == 'bounding_box'
        box = L.latLngBounds(latlngs)
        latlngs = [box.getNorthEast(), box.getNorthWest(), box.getSouthEast(), box.getSouthWest()]
        interpolationStrategy = 'cartesian'

      projectionSelect = @controls[0]
      projection = projectionSelect.items[hemisphere][1]

      # Pick the right projection
      if projection.indexOf('EASE') > 0
        proj = [Proj.epsg3408, Proj.epsg3409][hemisphere]
      else
        proj = [Proj.epsg3413, Proj.epsg3031][hemisphere]

      proj = proj.projection
      path = projectPath({latLngToLayerPoint: (ll) -> proj.project(ll)}, latlngs, [], interpolationStrategy, 10)

      bounds = L.bounds(path.boundary)

      @_xyBoxValues = [
        projection,
        Math.round(bounds.min.y),
        Math.round(bounds.min.x),
        Math.round(bounds.max.y),
        Math.round(bounds.max.x)
      ]

  $.echoforms.control(XYBoxSubsetter)
  $.echoforms.control(BoundingBox)

  null
