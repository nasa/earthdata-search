@edsc.util.which_transtion_event = do ($=jQuery) ->

  init: () ->
    @type = @findTransitionEvent()
    return {
      type: @type
    }


  findTransitionEvent: () ->
    tempEl = document.createElement('tempElement')
    transitions = {
      'transition'      : 'transitionend',
      'OTransition'     : 'oTransitionEnd',
      'MozTransition'   : 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    }

    for key, value of transitions
      if tempEl.style[key] != undefined
        return value

@edsc.util.which_transtion_event.init()
