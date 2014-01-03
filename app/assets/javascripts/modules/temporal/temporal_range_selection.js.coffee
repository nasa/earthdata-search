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
    roundTime: 'round',
    onChangeDateTime: (dp,$input) ->
      # queryField = if $input.hasClass('temporal-range-start') then 'range-start' else 'range-stop'
      # updateQueryModel(queryField, $input.val().replace(' ','T') + 'Z')
    onClose: (dp,$input) ->
      # queryField = if $input.hasClass('temporal-range-start') then 'range-start' else 'range-stop'
      # updateQueryModel(queryField, $input.val().replace(' ','T') + 'Z') if $input.val()?.length > 0
  })

  $('.temporal-recurring-picker').datetimepicker({
    format: 'm-d H:i:s',
    className: 'recurring-datetimepicker'
  })

  $('.temporal-recurring-year-range').slider({
    min: 1960,
    max: current_year,
    value: [1960, current_year],
    tooltip: 'hide'
  }).on 'slide', (e) ->
    $('.temporal-recurring-year-range-value').text(e.value.join(' - '))

  $('.temporal-recurring-year-range-value').text('1960 - ' + current_year)

  # Submit temporal range search
  $(document).on 'click', '#temporal-range-submit', ->
    start_datetime = $('.temporal-range-start').val()
    stop_datetime = $('.temporal-range-stop').val()
    formatted_start_datetime = if start_datetime?.length > 0 then start_datetime.replace(' ','T') + 'Z' else ''
    formatted_stop_datetime = if stop_datetime?.length > 0 then stop_datetime.replace(' ','T') + 'Z' else ''

    updateQueryModel('range-start', formatted_start_datetime)
    updateQueryModel('range-stop', formatted_stop_datetime)
    $(this).parents('.dropdown').removeClass('open')

    # Submit temporal recurring search
  $(document).on 'click', '#temporal-recurring-submit', ->
    year_range = $('.temporal-recurring-year-range-value').text().split(' - ')
    start_datetime = $('.temporal-recurring-start').val()
    stop_datetime = $('.temporal-recurring-stop').val()
    formatted_start_datetime = if start_datetime?.length > 0 then year_range[0] + '-' + start_datetime.replace(' ','T') + 'Z' else ''
    formatted_stop_datetime = if stop_datetime?.length > 0 then year_range[1] + '-' + stop_datetime.replace(' ','T') + 'Z' else ''
    date_start_datetime = new Date(formatted_start_datetime)
    date_stop_datetime = new Date(formatted_stop_datetime)

    # find day of the year selected
    one_day = 1000 * 60 * 60 * 24
    start_date_year = new Date( date_start_datetime.getFullYear(), 0, 0)
    stop_date_year = new Date( date_stop_datetime.getFullYear(), 0, 0)
    start_day = Math.floor((date_start_datetime - start_date_year) / one_day)
    stop_day = Math.floor((date_stop_datetime - stop_date_year) / one_day)

    updateQueryModel('recurring', [formatted_start_datetime, formatted_stop_datetime, start_day, stop_day])
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
