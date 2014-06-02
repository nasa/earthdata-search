this.edsc.util.url = do(window,
                        document,
                        History,
                        extend = jQuery.extend,
                        param = jQuery.param) ->

  pushPath = (path, title=document.title, data=null) ->
    History.pushState(data, title, path + window.location.search)

  saveState = (state, push = false) ->
    pathParts = [window.location.pathname]
    paramStr = param(state)
    pathParts.push(paramStr) if paramStr.length > 0
    path = pathParts.join('?')

    if window.location.search != paramStr
      if push
        History.pushState(state, document.title, path)
      else
        History.replaceState(state, document.title, path)
      true
    else
      false

  exports =
    pushPath: pushPath
    saveState: saveState
