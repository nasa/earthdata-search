window.edsc.util.xhr = do ($=jQuery) ->
  xhrPool = []
  $.ajaxSetup
    beforeSend: (xhr) ->
      xhrPool.push(xhr)
    complete: (xhr) ->
      index = xhrPool.indexOf(xhr)
      xhrPool.splice(index, 1) if (index > -1)


  hasPending = ->
    xhrPool.length > 0

  exports =
    hasPending: hasPending