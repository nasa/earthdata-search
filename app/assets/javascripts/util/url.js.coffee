this.edsc.util.url = do(window,
                        document,
                        History,
                        extend = jQuery.extend,
                        param = jQuery.param) ->

  cleanPath = ->
    # Remove everything up to the third slash
    History.getState().cleanUrl.replace(/^[^\/]*\/\/[^\/]*/, '')

  pushPath = (path, title=document.title, data=null) ->
    # Replace everything before the first ?
    path = cleanPath().replace(/^[^\?]*/, path)
    History.pushState(data, title, path)

  savedPath = null

  saveState = (path, state, push = false) ->
    paramStr = param(state).replace(/%5B/g, '[').replace(/%5D/g, ']')
    paramStr = '?' + paramStr if paramStr.length > 0
    path = path + paramStr

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

  exports =
    pushPath: pushPath
    saveState: saveState
    cleanPath: cleanPath
