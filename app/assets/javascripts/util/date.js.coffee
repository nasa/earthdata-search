window.edsc.util.date = do (string = window.edsc.util.string) ->

  # Returns an ISO-formatted date string (YYYY-MM-DD) containing the UTC value of the given date
  isoUtcDateString = (date) ->
    date.toISOString().split('T')[0]

  isoUtcDateTimeString = (date) ->
    date.toISOString().replace('T', ' ').replace(/\.\d{3}Z/, '')

  exports =
    isoUtcDateString: isoUtcDateString,
    isoUtcDateTimeString: isoUtcDateTimeString
