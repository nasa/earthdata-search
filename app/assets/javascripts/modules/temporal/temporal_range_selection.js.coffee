query = window.edsc.models.searchModel.query

current_year = new Date().getFullYear()

updateQueryModel = (type, value) ->
  switch type
    when 'range-start'
      query.temporal_start(value)
    when 'range-stop'
      query.temporal_stop(value)
    when 'recurring'
      query.temporal_recurring(value)

Date::formatDateTime = ->
  @getFullYear() + "-" + String.leftPad(@getMonth() + 1, 2, "0") + "-" + String.leftPad(@getDate(), 2, "0") + " " + String.leftPad(@getHours(), 2, "0") + ":" + String.leftPad(@getMinutes(), 2, "0") + ":" + String.leftPad(@getSeconds(), 2, "0")

$(document).ready ->
  validateTemporalInputs = ->
    start = $(".temporal-start:visible").val()
    end = $(".temporal-stop:visible").val()

    error = $(".temporal-dropdown .tab-pane.active .temporal-error")

    if start == "" or end == "" or start <= end
      error.hide()
    else
      error.show()
      # error.siblings().find(".submit.button").attr("disabled","disabled")

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
        <button id='day-of-year-submit' class='button' data-input='" + input.attr("id") + "'>Set</button>
        </div>")
      day_of_year_div.appendTo(picker)

  parseOrdinal = (value) ->
    match = /(\d{4})-(\d{3})/.exec(value)
    return null  unless match # Date is in the wrong format
    year = parseInt(match[1], 10)
    day = parseInt(match[2], 10)
    date = new Date(year, 0, day)
    return null  unless date.getFullYear() is year # Date is higher than the number of days in the year
    date.formatDateTime()

  findDayOfYear = (date) ->
    one_day = 1000 * 60 * 60 * 24
    date_year = new Date( date.getFullYear(), 0, 0)
    day = Math.floor((date - date_year) / one_day).toString()
    day = "0" + day  while day.length < 3
    day

  populateDayOfYear = (picker, date) ->
    day = findDayOfYear(date)
    $(picker).find(".day-of-year-input").val(date.getFullYear() + '-' + day)

  $(document).on 'change', '#day-of-year-submit', ->
    value = $(this).prev().val()
    date = parseOrdinal(value)
    if date
      $("#" + $(this).attr("data-input") + ":visible").val(date)
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
    onChangeMonth: (dp,$input) ->
      updateMonthButtons($(this).find('.xdsoft_month'))
  })

  $('.temporal-recurring-year-range').slider({
    min: 1960,
    max: current_year,
    value: [1960, current_year],
    tooltip: 'hide'
  }).on 'slide', (e) ->
    $('.temporal-recurring-year-range-value').text(e.value.join(' - '))

  $('.temporal-recurring-year-range-value').text('1960 - ' + current_year)

  formatDateTime = (datetime) ->
    if datetime?.length > 0 then datetime.replace(' ','T') + 'Z' else ''

  # Submit temporal range search
  updateTemporalRange = ->
    if $('#temporal-date-range .temporal-error').is(":hidden")
      start_datetime = $('.temporal-range-start').val()
      stop_datetime = $('.temporal-range-stop').val()
      formatted_start_datetime = formatDateTime(start_datetime)
      formatted_stop_datetime = formatDateTime(stop_datetime)

      updateQueryModel('range-start', formatted_start_datetime)
      updateQueryModel('range-stop', formatted_stop_datetime)
      true
    else
      false

  $(document).on 'click', '#temporal-range-submit', ->
    if updateTemporalRange()
      $(this).parents('.dropdown').removeClass('open')

  # Submit temporal recurring search
  updateTemporalRecurring = ->
    if $('#temporal-recurring .temporal-error').is(":hidden")
      year_range = $('.temporal-recurring-year-range-value').text().split(' - ')
      start_datetime = $('.temporal-recurring-start').val()
      stop_datetime = $('.temporal-recurring-stop').val()
      formatted_start_datetime = formatDateTime(year_range[0] + '-' + start_datetime)
      formatted_stop_datetime = formatDateTime(year_range[1] + '-' + stop_datetime)
      date_start_datetime = new Date(formatted_start_datetime)
      date_stop_datetime = new Date(formatted_stop_datetime)

      # find day of the year selected
      start_day = findDayOfYear(date_start_datetime)
      stop_day = findDayOfYear(date_stop_datetime)

      formatted_query = if start_datetime and stop_datetime
        [formatted_start_datetime, formatted_stop_datetime, start_day, stop_day]
      else
        ''

      updateQueryModel('recurring', formatted_query)
      true
    else
      false

  $(document).on 'click', '#temporal-recurring-submit', ->
    if updateTemporalRecurring()
      $(this).parents('.dropdown').removeClass('open')

  # Clear buttons within both temporal range and recurring dropdowns
  $(document).on 'click', '.temporal-clear', ->
    # handle clear buttons next to input fields
    $(this).prev('.temporal').val('')
    if $(this).prev('.temporal').hasClass('temporal-range-start')
      updateQueryModel('range-start', '')
    else if $(this).prev('.temporal').hasClass('temporal-range-stop')
      updateQueryModel('range-stop', '')

    # handle clear buttons at the bottom of each dropdown
    if $(this).hasClass('temporal-range')
      $(this).parents('.tab-pane').find('.temporal').val('')
      updateQueryModel('range-start', '')
      updateQueryModel('range-stop', '')
    else if $(this).hasClass('temporal-recurring')
      $(this).parents('.tab-pane').find('.temporal').val('')
      $('.temporal-recurring-year-range').slider('setValue', [1960, current_year])
      $('.temporal-recurring-year-range-value').text('1960 - ' + current_year)
      updateQueryModel('recurring', '')

    validateTemporalInputs()

  $(document).on 'click', '.clear-filters.button', ->
    validateTemporalInputs()

  $(document).on 'click', '.temporal-dropdown-link', ->
    if $(this).hasClass('temporal-range')
      updateQueryModel('recurring', '')
      updateTemporalRange()
    else if $(this).hasClass('temporal-recurring')
      updateQueryModel('range-start', '')
      updateQueryModel('range-stop', '')
      updateTemporalRecurring()

  $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker .xdsoft_today_button', ->
    updateMonthButtons($(this).siblings('.xdsoft_month'))

  $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker button.xdsoft_prev', ->
    updateMonthButtons($(this).siblings('.xdsoft_month'))

  $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker button.xdsoft_next', ->
    updateMonthButtons($(this).siblings('.xdsoft_month'))

  $(document).on 'click', 'input.day-of-year-input', ->
    $(this).focus()

  $('.temporal').blur ->
    validateTemporalInputs()
