#= require models/data/xhr_model
#= require models/data/variable

ns = @edsc.models.data

ns.Colors = do () ->

  # Maintains a finite pool of values to be distributed on demand.  Calling
  # next() on the pool returns either an unused value, prioritizing those
  # which have been returned to the pool most recently or, in the case where
  # there are no unused values, the value which has been checked out of the
  # pool the longest.
  class ValuePool
    constructor: (values) ->
      @_pool = values.concat()

    use: (value) ->
      @_remove(value)
      @_pool.push(value)
      value

    next: ->
      @use(@_pool[0])

    has: (value) ->
      @_pool.indexOf(value) != -1

    unuse: (value) ->
      @_remove(value)
      @_pool.unshift(value)
      value

    first: () ->
      @_pool[0]

    _remove: (value) ->
      index = @_pool.indexOf(value)
      @_pool.splice(index, 1) unless index == -1

  class ColorsModel
    constructor: () ->
      @green = '#2ECC71'
      @blue = '#3498DB'
      @orange = '#E67E22'
      @red = '#E74C3C'
      @purple = '#9B59B6'

      # Defines the color values for collections
      @collectionColorPool = new ValuePool([
        @blue,
        @orange,
        @green,
        @red,
        @purple
      ])

  exports = ColorsModel
