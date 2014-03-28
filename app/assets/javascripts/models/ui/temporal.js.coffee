ns = @edsc.models.ui

ns.Temporal = do (ko,
                  config=@edsc.config,
                  dateUtil=@edsc.util.date,
                  stringUtil = @edsc.util.string,
                  KnockoutModel=@edsc.models.KnockoutModel) ->

  current_year = new Date().getUTCFullYear()

  class TemporalDate extends KnockoutModel
    constructor: (@defaultYear, @isRecurring) ->
      @date = ko.observable(null)
      @year = ko.observable(@defaultYear)

      @year.subscribe @disposable((year) =>
        if @isRecurring()
          date = @date()
          if date?
            date.setUTCFullYear(year)
            @date(new Date(date.getTime())))

      @humanDateString = @computed
        read: =>
          if @date()?
            dateStr = dateUtil.isoUtcDateTimeString(@date())
            dateStr = dateStr.substring(5) if @isRecurring()
            dateStr
          else
            ""
        write: (dateStr) =>
          if dateStr?.length > 0
            dateStr = "#{@year()}-#{dateStr}" if @isRecurring()
            @date(new Date(dateStr.replace(' ', 'T') + 'Z'))
          else
            @date(null)

      @dayOfYearString = @computed
        read: =>
          date = @date()
          if date?
            "#{date.getUTCFullYear()}-#{stringUtil.padLeft(@dayOfYear(), '0', 3)}"
          else
            ""

        write: (dayStr) =>
          match = /(\d{4})-(\d{3})/.exec(dayStr)
          unless match
            @date(null)
            return
          year = parseInt(match[1], 10)
          day = parseInt(match[2], 10)
          date = new Date(Date.UTC(year, 0, day))
          unless date.getUTCFullYear() is year # Date is higher than the number of days in the year
            @date(null)
            return
          @date(date)

      @dayOfYear = @computed =>
        date = @date()
        if date?
          one_day = 1000 * 60 * 60 * 24
          year = 2007 # Sunday is January 1st, not a leap year
          #year = 2012 # Sunday is January 1st, leap year
          start_day = Date.UTC(year, 0, 0)
          end_day = Date.UTC(year, date.getUTCMonth(), date.getUTCDate())
          result = Math.floor((end_day - start_day) / one_day)
          result
        else
          null

      @queryDateString = @computed =>
        if @date()
          @date().toISOString()
        else
          null

    fromJson: (jsonObj) ->
      @date(new Date(jsonObj.date)) if jsonObj.date
      @year(jsonObj.year) if jsonObj.year

    serialize: ->
      {
        date: @date()?.getTime(),
        year: @year()
      }

    copy: (other) ->
      @date(other.date())
      @year(other.year())
      @isRecurring(other.isRecurring())

    clear: =>
      @date(null)
      @year(@defaultYear)

  class TemporalCondition extends KnockoutModel
    constructor: (@query) ->
      @isRecurring = ko.observable(false)
      @start = @disposable(new TemporalDate(1960, @isRecurring))
      @stop = @disposable(new TemporalDate(current_year, @isRecurring))

      @queryCondition = @computed(@_computeQueryCondition)
      @ranges = @computed(@_computeRanges, this, deferEvaluation: true)

      @years = @computed(@_computeYears())
      @yearsString = @computed => @years().join(' - ')

    fromJson: (jsonObj) ->
      @isRecurring(jsonObj.isRecurring)
      @start.fromJson(jsonObj.start)
      @stop.fromJson(jsonObj.stop)

    serialize: ->
      {
        isRecurring: @isRecurring()
        start: @start.serialize()
        stop: @stop.serialize()
      }

    copy: (other) ->
      @start.copy(other.start)
      @stop.copy(other.stop)
      @isRecurring(other.isRecurring())

    clear: =>
      @start.clear()
      @stop.clear()

    _computeRanges: ->
      {start, stop} = this
      result = []
      return result unless start.date()? || stop.date()?

      if @isRecurring()
        if start.date() && stop.date()
          one_day = 1000 * 60 * 60 * 24
          year = 2007 # Sunday is January 1st, not a leap year
          #year = 2012 # Sunday is January 1st, leap year
          start_in_year = new Date(start.date())
          start_in_year.setUTCFullYear(year)
          start_offset = start_in_year - Date.UTC(year, 0, 0)

          stop_in_year = new Date(stop.date())
          stop_in_year.setUTCFullYear(year)
          stop_offset = stop_in_year - Date.UTC(year, 0, 0)

          for year in [start.year()..stop.year()]
            year_start = Date.UTC(year, 0, 0)
            result.push [year_start + start_offset, year_start + stop_offset]
      else
        start_date = start.date() ? Date.UTC(1970, 0, 0)
        stop_date = stop.date() ? config.present()
        result.push [start_date, stop_date]

      result

    _computeYears: =>
      read: =>
        if @isRecurring()
          [@start.year(), @stop.year()]
        else
          []
      write: (values) =>
        @start.year(values[0])
        @stop.year(values[1])

    _computeQueryCondition: =>
      start = @start
      stop = @stop

      return null unless start.date()? || stop.date()?

      result = [start.queryDateString(), stop.queryDateString()]

      result = result.concat(start.dayOfYear(), stop.dayOfYear()) if @isRecurring()

      result.join(',')

  class Temporal extends KnockoutModel
    constructor: (@query) ->
      @applied = applied = @disposable(new TemporalCondition())
      @pending = pending = @disposable(new TemporalCondition())
      @query.temporal(applied)

      # Clear temporal when switching types
      pending.isRecurring.subscribe @disposable(=> pending.clear())

      # Copy applied to pending on change
      applied.isRecurring.subscribe @disposable((val) => pending.isRecurring(val))
      applied.start.date.subscribe @disposable((val) => pending.start.date(val))
      applied.start.year.subscribe @disposable((val) => pending.start.year(val))
      applied.stop.date.subscribe @disposable((val) => pending.stop.date(val))
      applied.stop.year.subscribe @disposable((val) => pending.stop.year(val))

    apply: =>
      @applied.copy(@pending)

  exports = Temporal