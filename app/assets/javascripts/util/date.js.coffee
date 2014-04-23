@edsc.util.date = do (string = @edsc.util.string) ->

  # Returns an ISO-formatted date string (YYYY-MM-DD) containing the UTC value of the given date
  isoUtcDateString = (date) ->
    date.toISOString().split('T')[0]

  isoUtcDateTimeString = (date) ->
    date.toISOString().replace('T', ' ').replace(/\.\d{3}Z/, '')

  dateToHuman = (date) ->
    if date?
      str = new Date(date).toString()
      match = str.match(/\(([^\)]+)\)/)
      return str unless match?
      tz = match[1]
      # Remove leading word (day of week)
      str = str.replace(/^\S+\s/, '')
      # Remove everything after the minutes
      str = str.replace(/:[^:]*$/, '')
      # Tack on the time zone code
      "#{str} #{tz}"
    else
      'Unknown'

  timeSpanToHuman = (t0, t1) ->
    "#{dateToHuman(t0)} to #{dateToHuman(t1)}"

  exports =
    isoUtcDateString: isoUtcDateString,
    isoUtcDateTimeString: isoUtcDateTimeString
    timeSpanToHuman: timeSpanToHuman
