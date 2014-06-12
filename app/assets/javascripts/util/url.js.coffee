this.edsc.util.url = do(window,
                        document,
                        History,
                        extend = jQuery.extend,
                        param = jQuery.param
                        deparam = @edsc.util.deparam
                        ) ->

  class ParamNameCompressor
    constructor: (@from, @to) ->

    swap: (params, from, to) ->
      return if from == to
      value = params[from]
      delete params[from]
      params[to] = value if value?

    compress: (params) -> @swap(params, @from, @to)
    inflate: (params) -> @swap(params, @to, @from)

  class ArrayJoiner extends ParamNameCompressor
    compress: (params) ->
      value = params[@from]
      params[@from] = value.join('!') if value?
      super(params)

    inflate: (params) ->
      super(params)
      value = params[@from]
      params[@from] = value.split('!') if value?

  class ParamFlattener extends ArrayJoiner
    constructor: (@path, @to, @isArray) ->
      @from = @to

    compress: (params) ->
      path = @path
      parent = params
      for key in path[...-1]
        parent = parent[key]
        return unless parent?
      value = parent[path[path.length - 1]]
      delete parent[path[path.length - 1]]
      params[@to] = value if value?
      super(params) if @isArray

    inflate: (params) ->
      return unless params[@to]
      super(params) if @isArray
      path = @path
      parent = params
      for key in path[...-1]
        parent[key] ?= {}
        parent = parent[key]
      parent[path[path.length - 1]] = params[@to]
      delete(params[@to])

  class ChildCompressor
    constructor: (@key, @compressor) ->

    eachChild: (params, method) ->
      children = params[@key]
      compressor = @compressor
      if children? && Array.isArray(children)
        compressor[method](child) for child in children when child?
      null

    compress: (params) -> @eachChild(params, 'compress')
    inflate: (params) -> @eachChild(params, 'inflate')

  # Specific compression for granule ids
  class GranuleIdListCompressor
    constructor: (@key) ->

    compress: (params) ->
      values = params[@key]
      if values && values.length > 0
        provId = values[0].split('-')[1]
        compressedValues = (v.split('-')[0][1...] for v in values)
        compressedValues.push(provId)
        params[@key] = compressedValues.join('!')

    inflate: (params) ->
      value = params[@key]
      if value
        values = value.split('!')
        provId = values.pop()
        params[@key] = ("G#{v}-#{provId}" for v in values)

  # The order here matters
  compressors = [
    new ParamNameCompressor('placename', 'qp')
    new ParamNameCompressor('temporal', 'qt')
    new ParamNameCompressor('free_text', 'q')
    new ParamNameCompressor('point', 'sp')
    new ParamNameCompressor('bounding_box', 'sb')
    new ParamNameCompressor('line', 'sl')
    new ParamNameCompressor('line', 'sg')

    new ParamFlattener(['two_d_coordinate_system', 'name'], 's2n')
    new ParamFlattener(['two_d_coordinate_system', 'coordinates'], 's2c')

    new ArrayJoiner('campaign', 'fc')
    new ArrayJoiner('platform', 'fp')
    new ArrayJoiner('instrument', 'fi')
    new ArrayJoiner('sensor', 'fs')
    new ArrayJoiner('two_d_coordinate_system_name', 'f2')
    new ArrayJoiner('processing_level', 'fl')

    new ParamFlattener(['science_keywords', '0', 'category'], 'fsc', true)
    new ParamFlattener(['science_keywords', '0', 'topic'], 'fst', true)
    new ParamFlattener(['science_keywords', '0', 'term'], 'fsm', true)
    new ParamFlattener(['science_keywords', '0', 'variable_level_1'], 'fs1', true)
    new ParamFlattener(['science_keywords', '0', 'variable_level_2'], 'fs2', true)
    new ParamFlattener(['science_keywords', '0', 'variable_level_3'], 'fs3', true)
    new ParamFlattener(['science_keywords', '0', 'detailed_variable'], 'fsd', true)

    new ChildCompressor('pg', new ParamNameCompressor('temporal', 'qt'))
    new ChildCompressor('pg', new ParamNameCompressor('day_night_flag', 'dnf'))
    new ChildCompressor('pg', new ParamNameCompressor('browse_only', 'bo'))
    new ChildCompressor('pg', new ParamNameCompressor('online_only', 'oo'))
    new ChildCompressor('pg', new ParamNameCompressor('cloud_cover', 'cc'))
    new ChildCompressor('pg', new ArrayJoiner('granule_ur', 'ur'))
    new ChildCompressor('pg', new ArrayJoiner('produer_granule_id', 'id'))
    new ChildCompressor('pg', new ParamFlattener(['exclude', 'echo_granule_id'], 'x'))
    new ChildCompressor('pg', new GranuleIdListCompressor('x'))
  ]

  alter = (params, method) ->

  compress = (params) ->
    params = extend(true, {}, params)
    compressor.compress(params) for compressor in compressors
    params

  inflate = (params) ->
    params = extend(true, {}, params)
    compressors[i].inflate(params) for i in [compressors.length-1..0]
    params

  cleanPath = ->
    # Remove everything up to the third slash
    History.getState().cleanUrl.replace(/^[^\/]*\/\/[^\/]*/, '')

  pushPath = (path, title=document.title, data=null) ->
    # Replace everything before the first ?
    path = cleanPath().replace(/^[^\?]*/, path)
    History.pushState(data, title, path)

  savedPath = null

  saveState = (path, state, push = false) ->
    paramStr = param(compress(state)).replace(/%5B/g, '[').replace(/%5D/g, ']')
    paramStr = '?' + paramStr if paramStr.length > 0
    path = path + paramStr

    if path.length > 200
      # assign a guid
      null

    if cleanPath() != path
      savedPath = path
      if push
        History.pushState(state, document.title, path)
      else
        History.replaceState(state, document.title, path)
      true
    else
      false

  # Raise a new event to avoid getting a statechange event when we ourselves change the state
  $(window).on 'statechange anchorchange', ->
    if cleanPath() != savedPath
      $(window).trigger('edsc.pagechange')

  currentQuery = ->
    cleanPath().split('?')[1] ? ''

  currentParams = ->
    inflate(deparam(currentQuery()))

  exports =
    pushPath: pushPath
    saveState: saveState
    cleanPath: cleanPath
    currentParams: currentParams
    currentQuery: currentQuery
