ns = @edsc.models.data

ns.GridCondition = do (ko, KnockoutModel=@edsc.models.KnockoutModel) ->

  class GridAxis
    constructor: (@label, @min, @max) ->

  class Grid
    constructor: (@name, @label, @axis0, @axis1) ->

  config = [
    ['CALIPSO',         'CALIPSO',             'orbit', 1, 75000, 'path',  1, 233],
    ['MISR',            'MISR',                'path',  1,   233, 'block', 1, 180],
    ['MODIS Tile EASE', 'MODIS EASE Grid',     'h',     0,    18, 'v',     0,  38],
    ['MODIS Tile SIN',  'MODIS Sinusoidal',    'h',     0,    35, 'v',     0,  17],
    ['WRS-1',           'WRS-1 (Landsat 1-3)', 'path',  1,   251, 'row',   1, 248],
    ['WRS-2',           'WRS-2 (Landsat 4+)',  'path',  1,   233, 'row',   1, 248]
  ]

  availableSystems = for system in config
    [name, label, a0label, a0min, a0max, a1label, a1min, a1max] = system
    a0 = new GridAxis(a0label, a0min, a0max)
    a1 = new GridAxis(a1label, a1min, a1max)
    new Grid(name, label, a0, a1)

  class GridCondition extends KnockoutModel
    constructor: ->
      @available = availableSystems
      @selected = ko.observable(null)

      @queryCondition = @computed
        read: =>
          selected = @selected()
          if selected
            condition = {name: selected.name}
            condition
          else
            null

        write: (params) =>
          name = params?.name
          systems = (sys for sys in @available when sys.name == name)
          @selected(systems[0])

    clear: ->
      @selected(null)

  exports = GridCondition