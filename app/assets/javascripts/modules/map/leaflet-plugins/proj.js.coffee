# Defines the 3 projections used by GIBS as objects usable in Leaflet

ns = window.edsc.map.L

ns.Proj = do (L, proj4) ->
  # # All GIBS tiles are 512px square
  # TILE_SIZE = 512
  #
  # # Parameters for stereographic projections
  # # https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Supported+Clients#GIBSSupportedClients-Usage%28PolarStereographic%29
  # GIBS_MAX_STEREO_EXT = 4194304
  # GIBS_MAX_STEREO_BOUNDS = [-GIBS_MAX_STEREO_EXT, -GIBS_MAX_STEREO_EXT, GIBS_MAX_STEREO_EXT, GIBS_MAX_STEREO_EXT]
  # GIBS_MAX_STEREO_RESOLUTION = 8192
  #
  # # Defines a coordinate reference system (CRS) for performing projections in Leaflet
  # GibsCRS = L.Class.extend
  #   includes: L.CRS
  #
  #   # # Constructs the CRS given maximum bounds, the maximum projected tile size, and
  #   # # a projection object.  The projection must support 'project' and 'unproject'
  #   # # methods expected by Leaflet.
  #   # initialize: (@code, @bounds, @baseResolution, @projection) ->
  #   #   @origin = [@bounds[0], @bounds[3]]
  #   #   @transformation = new L.Transformation(1, -@origin[0], -1, @origin[1])
  #
  #   # Overrides L.CRS.scale to account for differing projected tile sizes
  #   scale: (zoom) ->
  #     Math.pow(2, zoom) / @baseResolution
  #
  #   # # Overrides L.CRS.getSize to account for differing projected tile sizes
  #   # getSize: (zoom) ->
  #   #   zoomScale = @scale(zoom)
  #   #   bounds = @bounds
  #   #   projectedSize = TILE_SIZE / zoomScale
  #   #   L.point((bounds[2] - bounds[0]) * zoomScale,
  #   #           Math.ceil((bounds[3] - bounds[1]) / projectedSize) * projectedSize * zoomScale)
  #   #
  #   # distance: (latLng1, latLng2) ->
  #   #   L.CRS.Earth.distance(latLng1, latLng2)
  #
  # # A Leaflet-compatible projection which uses Proj4js to convert coordinates
  # Proj4Projection = L.Class.extend
  #   # Initialize with a definition string
  #   initialize: (str) ->
  #     @_proj4 = proj4(str)
  #     # @bounds = new L.Bounds(bound1, bound2)
  #
  #   project: (latLng) ->
  #     p = @_proj4.forward([latLng.lng, latLng.lat])
  #     L.point(p[0], p[1])
  #
  #   unproject: (point, unbounded) ->
  #     p = @_proj4.inverse([point.x, point.y])
  #     L.latLng(p[1], p[0], unbounded)


  # # EPSG:4326 (geo / plate carree)
  # epsg4326 = new GibsCRS('EPSG:4326',
  #                        [-180, -90, 180, 90],
  #                        360 / (TILE_SIZE + 128),
  #                        L.Projection.LonLat);
  #
  # # EPSG:3413 (arctic / stereographic)
  # epsg3413 = new GibsCRS('EPSG:3413',
  #                        GIBS_MAX_STEREO_BOUNDS,
  #                        GIBS_MAX_STEREO_RESOLUTION,
  #                        new Proj4Projection('+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'))
  #
  # # EPSG:3031 (antarctic / stereographic)
  # epsg3031 = new GibsCRS('EPSG:3031',
  #                        GIBS_MAX_STEREO_BOUNDS,
  #                        GIBS_MAX_STEREO_RESOLUTION,
  #                        new Proj4Projection('+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'))

  epsg4326 = new L.Proj.CRS(
    'EPSG:4326',
    '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs', {
      origin: [-180, 90],
      resolutions: [
        0.5625,
        0.28125,
        0.140625,
        0.0703125,
        0.03515625,
        0.017578125,
        0.0087890625,
        0.00439453125,
        0.002197265625
      ],
      bounds: L.Bounds([
        [-180, -90],
        [180, 90]
      ])
    }
  )

  epsg3413 = new L.Proj.CRS(
    'EPSG:3413',
    '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
      origin: [-4194304, 4194304],
      resolutions: [
        8192.0,
        4096.0,
        2048.0,
        1024.0,
        512.0,
        256.0
      ],
      bounds: L.bounds([
        [-4194304, -4194304],
        [4194304, 4194304]
      ])
    }
  )

  epsg3031 = new L.Proj.CRS(
    'EPSG:3031',
    '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs', {
      origin: [-4194304, 4194304],
      resolutions: [
        8192.0,
        4096.0,
        2048.0,
        1024.0,
        512.0,
        256.0
      ],
      bounds: L.Bounds([
        [-4194304, -4194304],
        [4194304, 4194304]
      ])
    }
  )

  # # NSIDC EASE-Grid North
  # epsg3408 =
  #   projection: new Proj4Projection("+proj=laea +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs")
  #
  # # NSIDC EASE-Grid South
  # epsg3409 =
  #   projection: new Proj4Projection("+proj=laea +lat_0=-90 +lon_0=0 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs")


  exports =
    epsg4326: epsg4326
    epsg3413: epsg3413
    epsg3031: epsg3031
    # epsg3408: epsg3408
    # epsg3409: epsg3409
