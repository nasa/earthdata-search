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

$(document).ready ->
  $('.temporal-range-picker').datetimepicker({
    format: 'Y-m-d H:i:s',
    yearStart: '1960',
    yearEnd: current_year,
    onShow: (dp,$input) ->
      setMinMaxOptions(this, $input, 'range')
    onChangeDateTime: (dp,$input) ->
      # Default minutes and seconds to 00
      datetime = $input.val().split(":")
      datetime[1] = "00"
      datetime[2] = "00"
      $input.val(datetime.join(":"))
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
    onChangeMonth: (dp,$input) ->
      updateMonthButtons($(this).find('.xdsoft_month'))
  })

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
    start_datetime = $('.temporal-range-start').val()
    stop_datetime = $('.temporal-range-stop').val()
    formatted_start_datetime = formatDateTime(start_datetime)
    formatted_stop_datetime = formatDateTime(stop_datetime)

    updateQueryModel('range-start', formatted_start_datetime)
    updateQueryModel('range-stop', formatted_stop_datetime)

  $(document).on 'click', '#temporal-range-submit', ->
    updateTemporalRange()
    $(this).parents('.dropdown').removeClass('open')

  # Submit temporal recurring search
  updateTemporalRecurring = ->
    year_range = $('.temporal-recurring-year-range-value').text().split(' - ')
    start_datetime = $('.temporal-recurring-start').val()
    stop_datetime = $('.temporal-recurring-stop').val()
    formatted_start_datetime = formatDateTime(year_range[0] + '-' + start_datetime)
    formatted_stop_datetime = formatDateTime(year_range[1] + '-' + stop_datetime)
    date_start_datetime = new Date(formatted_start_datetime)
    date_stop_datetime = new Date(formatted_stop_datetime)

    # find day of the year selected
    one_day = 1000 * 60 * 60 * 24
    start_date_year = new Date( date_start_datetime.getFullYear(), 0, 0)
    stop_date_year = new Date( date_stop_datetime.getFullYear(), 0, 0)
    start_day = Math.floor((date_start_datetime - start_date_year) / one_day)
    stop_day = Math.floor((date_stop_datetime - stop_date_year) / one_day)

    formatted_query = if start_datetime and stop_datetime
      [formatted_start_datetime, formatted_stop_datetime, start_day, stop_day]
    else
      ''

    updateQueryModel('recurring', formatted_query)

  $(document).on 'click', '#temporal-recurring-submit', ->
    updateTemporalRecurring()
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

  $(document).on 'click', '.temporal-dropdown-link', ->
    if $(this).hasClass('temporal-range')
      updateQueryModel('recurring', '')
      updateTemporalRange()
    else if $(this).hasClass('temporal-recurring')
      updateQueryModel('range-start', '')
      updateQueryModel('range-stop', '')
      updateTemporalRecurring()

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

  $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker .xdsoft_today_button', ->
    updateMonthButtons($(this).siblings('.xdsoft_month'))

  $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker button.xdsoft_prev', ->
    updateMonthButtons($(this).siblings('.xdsoft_month'))

  $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker button.xdsoft_next', ->
    updateMonthButtons($(this).siblings('.xdsoft_month'))
