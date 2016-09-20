@edsc.util.array = do ->

  pairs = (array, options={}) ->
    wrap = options.wrap ? true
    len = array.length
    len-- unless wrap

    [array[i], array[(i + 1) % len]] for i in [0...len]

  exports =
    pairs: pairs

if Array::find == undefined

  Array::find = (callback, thisArg) ->
    i = 0
    while i < @length
      if callback.call(thisArg or window, @[i], i, this)
        return @[i]
      i++
    undefined
