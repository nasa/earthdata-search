@edsc.util.string = do ->

  # Pad the given str (string) by prepending the given char (string) until it
  # is at least len (int) characters long
  padLeft = (str, char, len) ->
    str = "" + str
    char = "" + char
    while str.length < len
      str = char + str
    str

  dasherize = (str) ->
    str.trim().replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase()

  capitalize = (str) ->
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() if str?

  exports =
    padLeft: padLeft
    dasherize: dasherize
    capitalize: capitalize
