ns = @edsc.models

ns.KnockoutModel = do (ko) ->

  class KnockoutModel
    reference: ->
      @refCount ?= ko.observable(0)
      refs = @refCount
      val = refs.peek() + 1
      refs(val)
      this

    shouldDispose: ->
      true

    dispose: ->
      val = 0
      refs = @refCount
      if refs?
        val = refs.peek() - 1
        refs(val)
      if val <= 0 && @shouldDispose()
        @destroy()

    destroy: ->
      @_disposables ?= []
      for disposable in @_disposables
        disposable?.dispose?()
      @_disposables = []

    disposable: (obj) ->
      @_disposables ?= []
      @_disposables.push(obj)
      obj

    computed: (args...) ->
      @disposable(ko.computed(args...))

    asyncComputed: (args...) ->
      @disposable(ko.asyncComputed(args...))

  exports = KnockoutModel
