@edsc.util.date = do (string = @edsc.util.string) ->

  # Returns an ISO-formatted date string (YYYY-MM-DD) containing the UTC value of the given date
  isoUtcDateString = (date) ->
    @toISOString(date).split('T')[0]

  isoUtcDateTimeString = (date) ->
    @toISOString(date).replace('T', ' ').replace(/\.\d{3}Z/, '')

  parseIsoUtcString = (str) ->
    if !str || str.length == 0
      null
    else if !str.match(/^\d{4}(?:\D\d{1,2}){0,5}Z?$/)
      new Date(NaN)
    else
      components = str.split(/\D/g)
      components.pop() if components[components.length - 1].length == 0
      parsed = (parseInt(c, 10) for c in components)
      parsed.push(1) if parsed.length == 1 # Just a year provided
      parsed[1]--
      new Date(Date.UTC.apply(Date, parsed))

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

  dateToHumanUTC = (date) ->
    if date?
      str = new Date(date).toUTCString()
      tz = str.substring(str.length-3)
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

  timeSpanToIsoDate = (t0, t1) ->
    str0 = t0?.split('T')[0]
    str1 = t1?.split('T')[0]

    if str0 && str1
      if str0 == str1
        str0
      else
        "#{str0} to #{str1}"
    else if str0
      "#{str0} ongoing"
    else if str1
      "Up to #{str1}"
    else
      null

  # In tests, this command "new Date(-1815440446757.339).toISOString();" was
  # resulting in an ISO date string that looked like "1912-06-21T22:59:13.-757Z"
  # This method makes sure that doesn't happen
  toISOString = (date) ->
    date = new Date(date) unless date instanceof Date
    date.toISOString().replace('.-', '.')

  exports =
    isoUtcDateString: isoUtcDateString
    isoUtcDateTimeString: isoUtcDateTimeString
    parseIsoUtcString: parseIsoUtcString
    timeSpanToHuman: timeSpanToHuman
    dateToHumanUTC: dateToHumanUTC
    timeSpanToIsoDate: timeSpanToIsoDate
    toISOString: toISOString
