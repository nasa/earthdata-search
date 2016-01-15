@edsc.util.date = do (string = @edsc.util.string, config = @edsc.config) ->

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

  computeRanges = (temporal, present=config.present()) ->
    {startDate, endDate, recurring, startYear, endYear} = temporal
    result = []
    return result unless startDate? || endDate?

    if recurring
      if startDate? && endDate?
        one_day = 1000 * 60 * 60 * 24
        year = 2007 # Sunday is January 1st, not a leap year
        #year = 2012 # Sunday is January 1st, leap year
        start_in_year = new Date(startDate)
        start_in_year.setUTCFullYear(year)
        start_offset = start_in_year - Date.UTC(year, 0, 0)

        end_in_year = new Date(endDate)
        end_in_year.setUTCFullYear(year)
        end_offset = end_in_year - Date.UTC(year, 0, 0)

        for year in [startYear..endYear]
          year_start = Date.UTC(year, 0, 0)
          result.push [year_start + start_offset, year_start + end_offset]
    else
      start_date = startDate ? new Date(Date.UTC(1970, 0, 0))
      end_date = endDate ? new Date(present)
      result.push [start_date, end_date]

    result

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
    computeRanges: computeRanges
    isoUtcDateString: isoUtcDateString
    isoUtcDateTimeString: isoUtcDateTimeString
    parseIsoUtcString: parseIsoUtcString
    timeSpanToHuman: timeSpanToHuman
    dateToHumanUTC: dateToHumanUTC
    timeSpanToIsoDate: timeSpanToIsoDate
    toISOString: toISOString
