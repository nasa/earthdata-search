#= require util/xhr

this.edsc.util.url = do(window
                        document
                        History
                        extend = jQuery.extend
                        param = jQuery.param
                        deparam = @edsc.util.deparam
                        murmurhash3 = @edsc.util.murmurhash3
                        config = @edsc.config
                        ajax = @edsc.util.xhr.ajax
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
      value = value.toString() if typeof value == 'number'
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
  class CmrGranuleIdListCompressor
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

  class CwicGranuleIdListCompressor
    constructor: (@key) ->

    compress: (params) ->
      values = params[@key]
      compressedValues = []
      if values && values.length > 0
        values.map (v) -> if v.match(/^[0-9]+$/) then compressedValues.push(v) else compressedValues.push(murmurhash3(v))
        params[@key] = compressedValues.join('!')

    inflate: (params) ->
      value = params[@key]
      value = value.toString() if value?.constructor == Number
      params[@key] = value?.split('!')

  # The order here matters
  compressors = [
    new ParamNameCompressor('placename', 'qp')
    new ParamNameCompressor('temporal', 'qt')
    new ParamNameCompressor('free_text', 'q')
    new ParamNameCompressor('original_keyword', 'ok')
    new ParamNameCompressor('point', 'sp')
    new ParamNameCompressor('bounding_box', 'sb')
    new ParamNameCompressor('line', 'sl')
    new ParamNameCompressor('line', 'sg')

    new ArrayJoiner('features', 'ff')
    new ArrayJoiner('data_center_h', 'fdc')
    new ArrayJoiner('project_h', 'fpj')
    new ArrayJoiner('platform_h', 'fp')
    new ArrayJoiner('instrument_h', 'fi')
#    new ArrayJoiner('sensor_h', 'fs')
    new ArrayJoiner('processing_level_id_h', 'fl')

    new ChildCompressor('pg', new ParamNameCompressor('temporal', 'qt'))
    new ChildCompressor('pg', new ParamNameCompressor('day_night_flag', 'dnf'))
    new ChildCompressor('pg', new ParamNameCompressor('browse_only', 'bo'))
    new ChildCompressor('pg', new ParamNameCompressor('online_only', 'oo'))
    new ChildCompressor('pg', new ParamNameCompressor('cloud_cover', 'cc'))
    new ChildCompressor('pg', new ArrayJoiner('readable_granule_name', 'id'))
    new ChildCompressor('pg', new ArrayJoiner('readable_granule_name', 'ur'))
    new ChildCompressor('pg', new ParamFlattener(['exclude', 'echo_granule_id'], 'x'))
    new ChildCompressor('pg', new ParamFlattener(['exclude', 'cwic_granule_id'], 'cx'))
    new ChildCompressor('pg', new CmrGranuleIdListCompressor('x'))
    new ChildCompressor('pg', new CwicGranuleIdListCompressor('cx'))
  ]

#   new ParamFlattener(['science_keywords_h', '0', 'category'], 'fsc', false)
  keywords = []
  for index in [0...6]
    keywords.push new ParamFlattener(['science_keywords_h', index, 'topic'], "fst#{index}", false)
    keywords.push new ParamFlattener(['science_keywords_h', index, 'term'], "fsm#{index}", false)
    keywords.push new ParamFlattener(['science_keywords_h', index, 'variable_level_1'], "fs1#{index}", false)
    keywords.push new ParamFlattener(['science_keywords_h', index, 'variable_level_2'], "fs2#{index}", false)
    keywords.push new ParamFlattener(['science_keywords_h', index, 'variable_level_3'], "fs3#{index}", false)
    keywords.push new ParamFlattener(['science_keywords_h', index, 'detailed_variable'], "fsd#{index}", false)

  compressors = compressors.concat keywords

  alter = (params, method) ->

  _removeNullScienceKeywords = (params) ->
    if params['science_keywords_h']
      (tmp or tmp = []).push sk for sk in params['science_keywords_h'] when sk
      params['science_keywords_h'] = tmp

  compress = (params) ->
    params = extend(true, {}, params)
    _removeNullScienceKeywords params
    compressor.compress(params) for compressor in compressors
    params

  inflate = (params) ->
    params = extend(true, {}, params)
    _removeNullScienceKeywords params
    compressors[i].inflate(params) for i in [compressors.length-1..0]
    params

  realPath = ->
    # Remove everything up to the third slash
    History.getState().cleanUrl.replace(/^[^\/]*\/\/[^\/]*/, '').replace(/%5B/g, '[').replace(/%5D/g, ']')

  realQuery = ->
    realPath().split('?')[1] ? ''

  savedPath = null
  savedId = null
  savedName = null

  getProjectName = ->
    savedName

  fullPath = (path) ->
    return '' unless path?
    path = path.replace(/^\/portal\/[\w]+/, '')
    path = path.replace(/([?&])portal=[^&]*&?/g, '$1')
    path = path.replace(/\?$/, '')
    portalPrefix = window.location.pathname.match(/^\/?portal\/[\w]+/)?[0] || ''
    portalPrefix = '/' + portalPrefix if portalPrefix.length > 0 && portalPrefix.indexOf('/') != 0
    "#{portalPrefix}#{path}".replace(/\/\//g, '/')

  fetchId = (id, params) ->
    return if savedId == id
    console.log "Fetching project #{id}"
    savedId = id
    ajax
      method: 'get'
      dataType: 'json'
      url: "/projects/#{id}"
      success: (data) ->
        if params.length > 0
          prefix = '&'
          prefix = '?' if data.path.indexOf('?') == -1
          data.path += prefix + params

        if data.new_id?
          savedId = data.new_id
          History.pushState('', '', "/#{data.path.split('?')[0]}?projectId=#{savedId}")

        if data.user_id? && data.user_id == -1
          History.pushState('', '', data.path)

        savedPath = data.path
        savedName = data.name
        console.log "Fetched project #{id}"
        console.log "Path: #{data.path}"
        console.log "Project Name: #{data.name}"
        $(window).trigger('edsc.pagechange')

  shortenPath = (path, state, workspaceName = null) ->
    id = savedId ? ''
    savedPath = path
    console.log "Saving project #{id}"
    console.log "Path: #{path}"
    console.log "Workspace Name: #{workspaceName}"
    data = {path: fullPath(path), workspace_name: workspaceName}
    ajax
      method: 'post'
      dataType: 'text'
      url: "/projects?id=#{id}"
      data: data
      success: (data) ->
        console.log "Saved project #{id}"
        console.log "Path: #{path}"
        savedId = data
        History.pushState(state, document.title, fullPath("/#{path.split('?')[0]}?projectId=#{savedId}"))
        $(document).trigger('edsc.saved') if workspaceName?


  cleanPathWithPortal = ->
    path = realPath()
    if path.indexOf("projectId=") != -1
      params = deparam(path.split('?')[1])
      id = params.projectId + ''
      delete params.projectId
      if savedPath? && savedId == id
        result = savedPath
      else
        fetchId(id, param(params))
    else
      result = path
    result = result.replace(/^\/#/, '/') if result? # IE 9 bug with URL hashes
    result

  cleanPath = ->
    path = cleanPathWithPortal()
    path.replace(/^\/portal\/[\w]+/, '') if path

  pushPath = (path, title=document.title, data=null) ->
    clean = cleanPath()
    if clean?
      # Replace everything before the first ?
      path = cleanPath().replace(/^[^\?]*/, path)
      History.pushState(data, title, fullPath(path))

  saveState = (path, state, push = false, workspaceName = null) ->
    paramStr = param(compress(state)).replace(/%5B/g, '[').replace(/%5D/g, ']')
    paramStr = '?' + paramStr if paramStr.length > 0

    regex = /([?&])(m=[^&]*&?)|(tl=[^&]*&?)/g
    tempNewParams = paramStr.replace(regex, '$1')
    tempOldParams = "?#{realQuery()}".replace(regex, '$1')
    tempNewParams = '?' if tempNewParams.length == 0 && tempOldParams == '?'
    if realPath().split('?')[0] != path || tempOldParams != tempNewParams
      $(document).trigger('pageview', [path, state])

    path = path.replace(/^\/#/, '/') # IE 9 bug with URL hashes
    path = path + paramStr
    # Avoid shortening urls when cmr_env is set
    isTooLong = path.length > config.urlLimit && path.indexOf('cmr_env=') == -1
    if workspaceName || isTooLong
      if path != savedPath || (workspaceName && savedName != workspaceName)
        # assign a guid
        shortenPath(path, state, workspaceName)
        return

    if cleanPath() && cleanPath() != path
      savedPath = path
      savedId = null
      if push
        History.pushState(state, document.title, fullPath(path))
      else
        History.replaceState(state, document.title, fullPath(path))
      true
    else
      false

  # Raise a new event to avoid getting a statechange event when we ourselves change the state
  $(window).on 'statechange anchorchange', ->
    if cleanPath() != savedPath
      $(window).trigger('edsc.pagechange')
      savedPath = cleanPath()

  currentQuery = ->
    path = cleanPathWithPortal()?.split('?')
    return '' unless path?
    portal = path[0].match(/^\/portal\/([\w]+)/)?[1]
    result = path[1] ? ''
    if portal
      portalParam = "portal=#{portal}"
      portalParam = "&#{portalParam}" if result.length > 0
      result += portalParam
    result

  currentParams = ->
    inflate(deparam(currentQuery()))

  exports =
    getProjectName: getProjectName
    pushPath: pushPath
    saveState: saveState
    realQuery: realQuery
    cleanPath: cleanPath
    currentParams: currentParams
    currentQuery: currentQuery
    fullPath: fullPath
