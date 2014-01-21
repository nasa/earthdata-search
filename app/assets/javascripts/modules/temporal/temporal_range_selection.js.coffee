query = @edsc.models.page.current.query
edsc_date = @edsc.util.date

current_year = new Date().getFullYear()

$(document).ready ->
  validateTemporalInputs = ->
    start = $(".temporal-start:visible")
    end = $(".temporal-stop:visible")
    start_val = start.val()
    end_val = end.val()

    if start and stop
      error = $(".temporal-dropdown .tab-pane.active .temporal-error")
      error.show()

      if start.hasClass("temporal-recurring-start")
        # Recurring start and stop must both be selected
        if start_val == "" ^ end_val == ""
          error.text("Start and End dates must both be selected")
        else if start_val > end_val
          error.text("Start must be no later than End")
        else
          error.hide()
      else
        if start_val == "" or end_val == "" or start_val <= end_val
          error.hide()
        else
          error.text("Start must be no later than End")


  setMinMaxOptions = (datetimepicker, $input, temporal_type) ->
    min_date = false
    max_date = false
    format = if temporal_type == "range" then 'Y-m-d' else 'm-d'

    start_val = $('input.temporal-' + temporal_type + '-start').val()
    stop_val = $('input.temporal-' + temporal_type + '-stop').val()

    if $input.hasClass('temporal-' + temporal_type + '-start') and stop_val
      max_date = stop_val.split(' ')[0]
    else if $input.hasClass('temporal-' + temporal_type + '-stop') and start_val
      min_date = start_val.split(' ')[0]

    datetimepicker.setOptions({
      minDate: min_date,
      maxDate: max_date,
      formatDate: format
    })

  updateMonthButtons = (month_label) ->
    prev_button = $(month_label).siblings('button.xdsoft_prev')
    next_button = $(month_label).siblings('button.xdsoft_next')
    prev_button.show()
    next_button.show()
    month = month_label.find('span').text()
    if month == "January"
      prev_button.hide()
    else if month == "December"
      next_button.hide()

  addDayOfYear = (picker, input) ->
    if picker.find('.day-of-year-picker')?.length == 0
      day_of_year_div = $("<div class='day-of-year-picker'>
        <label for='day-of-year-input'>Day of Year:</label>
        <input id='day-of-year-input' class='day-of-year-input' type='text' placeholder='YYYY-DDD' >
        <button id='day-of-year-submit' class='button text-button' data-input='" + input.attr("id") + "'>Set</button>
        </div>")
      day_of_year_div.appendTo(picker)

  parseOrdinal = (value) ->
    match = /(\d{4})-(\d{3})/.exec(value)
    return null  unless match # Date is in the wrong format
    year = parseInt(match[1], 10)
    day = parseInt(match[2], 10)
    date = new Date(year, 0, day)
    return null  unless date.getFullYear() is year # Date is higher than the number of days in the year
    edsc_date.isoUtcDateTimeString(date)

  findDayOfYear = (date) ->
    one_day = 1000 * 60 * 60 * 24
    date_year = new Date( date.getFullYear(), 0, 0)
    day = Math.floor((date - date_year) / one_day).toString()
    day = "0" + day  while day.length < 3
    day

  populateDayOfYear = (picker, date) ->
    day = findDayOfYear(date)
    $(picker).find(".day-of-year-input").val(date.getFullYear() + '-' + day)

  $(document).on 'click', '#day-of-year-submit', ->
    value = $(this).prev().val()
    date = parseOrdinal(value)
    if date
      $("#" + $(this).attr("data-input") + ":visible").val(date).trigger('change')
      $(this).parents('.xdsoft_datetimepicker').hide()
      validateTemporalInputs()

  $('.temporal-range-picker').datetimepicker({
    format: 'Y-m-d H:i:s',
    yearStart: '1960',
    yearEnd: current_year,
    onShow: (dp,$input) ->
      setMinMaxOptions(this, $input, 'range')
      populateDayOfYear(this, new Date($input.val())) if $input.val()
    onChangeDateTime: (dp,$input) ->
      # Default minutes and seconds to 00
      datetime = $input.val().split(":")
      datetime[1] = "00"
      datetime[2] = "00"
      $input.val(datetime.join(":"))

      populateDayOfYear(this, new Date($input.val())) if $input.val()

      validateTemporalInputs()

      $input.trigger('change')
    onGenerate: (dp,$input) ->
      addDayOfYear(this, $input)
  })

  $('.temporal-recurring-picker').datetimepicker({
    format: 'm-d H:i:s',
    className: 'recurring-datetimepicker',
    yearStart: current_year,
    yearEnd: current_year,
    onShow: (dp,$input) ->
      updateMonthButtons($(this).find('.xdsoft_month'))
      setMinMaxOptions(this, $input, 'recurring')
    onChangeDateTime: (dp,$input) ->
      # Default minutes and seconds to 00
      datetime = $input.val().split(":")
      datetime[1] = "00"
      datetime[2] = "00"
      $input.val(datetime.join(":"))

      validateTemporalInputs()

      $input.trigger('change')
    onChangeMonth: (dp,$input) ->
      updateMonthButtons($(this).find('.xdsoft_month'))
  })

  $('.temporal-recurring-year-range').slider({
    min: 1960,
    max: current_year,
    value: [1960, current_year],
    tooltip: 'hide'
  }).on 'slide', (e) ->
    query.temporal_recurring_year_range(e.value.join(" - "))

  query.temporal_recurring_year_range("1960 - " + current_year)

  formatDateTimeString = (datetime) ->
    if datetime?.length > 0 then datetime.replace(' ','T') + 'Z' else ''

  # Submit temporal range search
  updateTemporalRange = ->
    if $('#temporal-date-range .temporal-error').is(":hidden")
      query.switchTemporal('range')
    else
      false

  $(document).on 'click', '#temporal-range-submit', ->
    if updateTemporalRange()
      $(this).parents('.dropdown').removeClass('open')

  # Submit temporal recurring search
  updateTemporalRecurring = ->
    if $('#temporal-recurring .temporal-error').is(":hidden")
      query.switchTemporal('recurring')
    else
      false

  $(document).on 'click', '#temporal-recurring-submit', ->
    if updateTemporalRecurring()
      $(this).parents('.dropdown').removeClass('open')

  $(document).on 'click', '.clear-filters.button, .temporal-clear', ->
    validateTemporalInputs()

  $(document).on 'click', '.temporal-dropdown-link', ->
    if $(this).hasClass('temporal-range')
      updateTemporalRange()
    else if $(this).hasClass('temporal-recurring')
      updateTemporalRecurring()

  $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker .xdsoft_today_button', ->
    updateMonthButtons($(this).siblings('.xdsoft_month'))

  $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker button.xdsoft_prev', ->
    updateMonthButtons($(this).siblings('.xdsoft_month'))

  $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker button.xdsoft_next', ->
    updateMonthButtons($(this).siblings('.xdsoft_month'))

  $(document).on 'click', 'input.day-of-year-input', ->
    $(this).focus()

  $('.temporal').on 'change paste keyup', ->
    validateTemporalInputs()
