ns = @edsc.models

ns.KnockoutModel = do (ko) ->

  class KnockoutModel
    reference: ->
      @refCount ?= ko.observable(0)
      refs = @refCount
      val = refs() + 1
      refs(val)
      this

    dispose: ->
      val = 0
      refs = @refCount
      if refs?
        val = refs() - 1
        refs(val)
      if val <= 0
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
