ns = @edsc.models

ns.KnockoutModel = do (ko) ->

  class KnockoutModel
    dispose: ->
      @_disposables ?= []
      for disposable in @_disposables
        disposable?.dispose?()
      @_disposables = []

      @isDisposed = true

    disposable: (obj) ->
      @_disposables ?= []
      @_disposables.push(obj)
      obj

    computed: (args...) ->
      @disposable(ko.computed(args...))

    asyncComputed: (args...) ->
      @disposable(ko.asyncComputed(args...))

  exports = KnockoutModel
