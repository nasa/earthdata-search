do (ko, $=jQuery) ->

  # For observables that need to make an XHR or similar call to compute their value
  ko.asyncComputed = (initialValue, timeout, method, obj) ->
    value = ko.observable(initialValue)

    isSetup = ko.observable(false)

    isPendingRead = true

    callAsyncMethod = ->
      method.call obj, value.peek(), value, isPendingRead
      isPendingRead = true

    asyncComputed = ko.computed
      read: ->
        val = value.peek()
        callAsyncMethod()
        val
      write: value
      deferEvaluation: true

    result = ko.computed
      read: ->
        # Causes an evaluation of computed, thereby setting up dependencies correctly
        unless isSetup()
          asyncComputed.extend(throttle: timeout)
          isSetup(true)
        value()
      write: (newValue) ->
        isSetup(true) unless isSetup()
        value(newValue)
      deferEvaluation: true

    result.isSetup = isSetup

    result.readImmediate = ->
      callAsyncMethod()
      isPendingRead = false

    originalDispose = result.dispose
    result.dispose = ->
      originalDispose()
      asyncComputed.dispose()

    result
