window.edsc.util.date = do (string = window.edsc.util.string) ->

  pad = string.padLeft

  # Returns an ISO-formatted date string (YYYY-MM-DD) containing the UTC value of the given date
  isoUtcDateString = (date) ->
    "#{date.getUTCFullYear()}-#{pad(date.getUTCMonth() + 1, '0', 2)}-#{pad(date.getUTCDate(), '0', 2)}"

  isoUtcDateTimeString = (date) ->
    isoUtcDateString(date) + " #{pad(date.getHours(), '0', 2)}:#{pad(date.getMinutes(), '0', 2)}:#{pad(date.getSeconds(), '0', 2)}"

  queryDateString = (date) ->
    if date?.length > 0
      date.replace(" ", "T") + "Z"
    else
      date

  findDayOfYear = (date) ->
    one_day = 1000 * 60 * 60 * 24
    date_year = new Date( date.getFullYear(), 0, 0)
    day = Math.floor((date - date_year) / one_day).toString()
    day = "0" + day  while day.length < 3
    day


  exports =
    isoUtcDateString: isoUtcDateString,
    isoUtcDateTimeString: isoUtcDateTimeString
    queryDateString: queryDateString
    findDayOfYear: findDayOfYear
