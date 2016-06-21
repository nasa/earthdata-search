@edsc.util.array = do ->

  pairs = (array, options={}) ->
    wrap = options.wrap ? true
    len = array.length
    len-- unless wrap

    [array[i], array[(i + 1) % len]] for i in [0...len]

  exports =
    pairs: pairs
