this.edsc.util.url = do(window,
                        document,
                        History,
                        extend = jQuery.extend,
                        param = jQuery.param) ->

  pushPath = (path, title=document.title, data=null) ->
    History.pushState(data, title, path + window.location.search)

  savedState = null
  savedPath = null

  saveState = (path, state, push = false) ->
    paramStr = param(state)
    paramStr = '?' + paramStr if paramStr.length > 0

    if window.location.pathname != path || window.location.search != paramStr
      savedState = paramStr
      savedPath = path
      if push
        History.pushState(state, document.title, path + paramStr)
      else
        History.replaceState(state, document.title, path + paramStr)
      true
    else
      false

  # Raise a new event to avoid getting a statechange event when we ourselves change the state
  $(window).on 'statechange anchorchange', ->
    if window.location.search != savedState || window.location.pathname != savedPath
      $(window).trigger('edsc.pagechange')

  exports =
    pushPath: pushPath
    saveState: saveState
