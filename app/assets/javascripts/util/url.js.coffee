this.edsc.util.url = do(window,
                        document,
                        History,
                        extend = jQuery.extend,
                        param = jQuery.param) ->

  pushPath = (path, title=document.title, data=null) ->
    History.pushState(data, title, path + window.location.search)

  savedState = null

  saveState = (state, push = false) ->
    path = window.location.pathname
    paramStr = param(state)
    paramStr = '?' + paramStr if paramStr.length > 0
    path = path + paramStr

    if window.location.search != paramStr
      savedState = paramStr
      if push
        History.pushState(state, document.title, path)
      else
        History.replaceState(state, document.title, path)
      true
    else
      false

  # Raise a new event to avoid getting a statechange event when we ourselves change the state
  $(window).on 'statechange anchorchange', ->
    if window.location.search != savedState
      $(window).trigger('edsc.pagechange')

  exports =
    pushPath: pushPath
    saveState: saveState
