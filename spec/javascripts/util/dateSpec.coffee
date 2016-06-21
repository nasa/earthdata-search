
describe 'date', ->
  dateUtil = window.edsc.util.date

  describe 'parseIsoUtcString', ->
    assertParse = (name, input, output) ->
      it name, ->
        parsed = dateUtil.parseIsoUtcString(input)
        if !parsed
          expect(parsed).toEqual(output)
        else if isNaN(parsed.getTime())
          expect(parsed.toString()).toEqual(output)
        else
          expect(parsed.toISOString().replace('.000Z', 'Z')).toEqual(output)

    assertParse 'parses full ISO 8601 date/times', '2015-02-03T04:05:06Z', '2015-02-03T04:05:06Z'
    assertParse 'parses partial ISO 8601 date/times', '2015-02-03T04', '2015-02-03T04:00:00Z'
    assertParse 'parses full date/times in space-separated format', '2015-02-03 04:05:06', '2015-02-03T04:05:06Z'
    assertParse 'parses partial date/times in space-separated format', '2015-02-03 04', '2015-02-03T04:00:00Z'
    assertParse 'parses partial date/times with a trailing timezone indicator', '2015-02-03Z', '2015-02-03T00:00:00Z'
    assertParse 'parses dates without a time', '2015-02-03', '2015-02-03T00:00:00Z'
    assertParse 'parses dates without a day', '2015-02', '2015-02-01T00:00:00Z'
    assertParse 'parses dates without a month', '2015', '2015-01-01T00:00:00Z'
    assertParse 'parses date/times with alternative punctuation', '2015/02/03 04-05-06', '2015-02-03T04:05:06Z'
    assertParse 'parses date/times without leading 0s on components', '2015-2-3 4:5:6', '2015-02-03T04:05:06Z'

    assertParse 'returns null for empty strings', '', null
    assertParse 'returns null for null input', null, null

    assertParse 'returns an invalid date for date/times ending in a separator', '2015-02-', 'Invalid Date'
    assertParse 'returns an invalid date for date/times starting with a non-digit', ' 2015-02-', 'Invalid Date'
    assertParse 'returns an invalid date for date/times with too many digits', '2015-002', 'Invalid Date'
    assertParse 'returns an invalid date for date/times with double-separators', '2015--02', 'Invalid Date'
    assertParse 'returns an invalid date for date/times with too many components', '2015-02-03T04:05:06.007Z', 'Invalid Date'
    assertParse 'returns an invalid date for date/times with an incomplete year', '201', 'Invalid Date'
    assertParse 'returns an invalid date for date/times containing alphabetic components', 'Tue Feb 3 2015 04:05:06', 'Invalid Date'
    assertParse 'returns an invalid date for date/times containing non-dates', 'invalid', 'Invalid Date'
    assertParse 'returns an invalid date for date/times containing only a time zone indicator', 'Z', 'Invalid Date'
    assertParse 'returns an invalid date for date/times containing only a non-zulu timezone', '2015-02-03T04:00:00+00:00', 'Invalid Date'
