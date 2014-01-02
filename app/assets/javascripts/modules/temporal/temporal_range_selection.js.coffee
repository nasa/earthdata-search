query = window.edsc.models.searchModel.query

updateQueryModel = (type, value) ->
  switch type
    when 'range-start'
      query.temporal_start(value)
    when 'range-stop'
      query.temporal_stop(value)
    when 'recurring'
      query.temporal_recurring(value)

$(document).ready ->
  $('.temporal-range-start').datetimepicker({
    format: 'Y-m-d H:i:s',
    yearStart: '1960',
    yearEnd: new Date().getFullYear(),
    roundTime: 'round',
    onChangeDateTime: (dp,$input) ->
      updateQueryModel('range-start', $input.val().replace(' ','T') + 'Z')
    onClose: (dp,$input) ->
      updateQueryModel('range-start', $input.val().replace(' ','T') + 'Z') if $input.val()?.length > 0
  })

  $('.temporal-range-stop').datetimepicker({
    format: 'Y-m-d H:i:s',
    yearStart: '1960',
    yearEnd: new Date().getFullYear(),
    onChangeDateTime: (dp,$input) ->
      updateQueryModel('range-stop', $input.val().replace(' ','T') + 'Z')
    onClose: (dp,$input) ->
      updateQueryModel('range-stop', $input.val().replace(' ','T') + 'Z') if $input.val()?.length > 0
  })

  $('.temporal-recurring-start').datetimepicker({
    format: 'm-d H:i:s',
    className: 'recurring-datetimepicker'
  })

  $('.temporal-recurring-stop').datetimepicker({
    format: 'm-d H:i:s',
    className: 'recurring-datetimepicker'
  })

  $('.temporal-recurring-year-range').slider({
    min: 1960,
    max: new Date().getFullYear(),
    value: [1960, new Date().getFullYear()],
    tooltip: 'hide'
  }).on 'slide', (e) ->
    $('.temporal-recurring-year-range-value').text(e.value.join(' - '))

  $('.temporal-recurring-year-range-value').text('1960 - ' + new Date().getFullYear())

  $(document).on 'click', '#temporal-recurring-submit', ->
    year_range = $('.temporal-recurring-year-range-value').text().split(' - ')
    start_datetime = year_range[0] + '-' + $('.temporal-recurring-start').val().replace(' ','T') + 'Z'
    stop_datetime = year_range[1] + '-' + $('.temporal-recurring-stop').val().replace(' ','T') + 'Z'

    # find day of the year selected
    one_day = 1000 * 60 * 60 * 24
    start_date_year = new Date( new Date(start_datetime).getFullYear(), 0, 0)
    stop_date_year = new Date( new Date(stop_datetime).getFullYear(), 0, 0)
    start_day = Math.floor((new Date(start_datetime) - start_date_year) / one_day)
    stop_day = Math.floor((new Date(stop_datetime) - stop_date_year) / one_day)

    updateQueryModel('recurring', [start_datetime, stop_datetime, start_day, stop_day])

  $(document).on 'click', '.temporal-clear', ->
    $(this).prev('.temporal').val('')
    if $(this).prev('.temporal').hasClass('temporal-range-start')
      updateQueryModel('range-start', '')
    else if $(this).prev('.temporal').hasClass('temporal-range-stop')
      updateQueryModel('range-stop', '')

  $(document).on 'click', '#temporal-recurring-clear', ->
    $('.temporal').val('')
    $('.temporal-recurring-year-range').slider('setValue', [1960,new Date().getFullYear()])
    $('.temporal-recurring-year-range-value').text('1960 - ' + new Date().getFullYear())
    updateQueryModel('recurring', '')
