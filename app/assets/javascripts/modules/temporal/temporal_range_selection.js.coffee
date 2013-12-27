query = window.edsc.models.searchModel.query

$(document).ready ->
  $('#temporal-date-range #temporal_start').datetimepicker({
    format: 'Y-m-d H:00:00',
    yearStart: '1960',
    yearEnd: new Date().getFullYear(),
    roundTime: 'round',
    onChangeDateTime: (dp,$input) ->
      query.temporal_start($input.val().replace(' ','T') + 'Z')
  })

  $('#temporal-date-range #temporal_stop').datetimepicker({
    format: 'Y-m-d H:00:00',
    yearStart: '1960',
    yearEnd: new Date().getFullYear(),
    onChangeDateTime: (dp,$input) ->
      query.temporal_stop($input.val().replace(' ','T') + 'Z')
  })

  $('#temporal-recurring #temporal_start').datetimepicker({
    format: 'm-d H:00:00',
    className: 'recurring-datetimepicker'
  })

  $('#temporal-recurring #temporal_stop').datetimepicker({
    format: 'm-d H:00:00',
    className: 'recurring-datetimepicker'
  })

  $('#temporal-recurring-year-range').slider({
    min: 1960,
    max: new Date().getFullYear(),
    value: [1960, new Date().getFullYear()],
    tooltip: 'hide'
  }).on 'slide', (e) ->
    $('#temporal-recurring-year-range-value').text(e.value.join(' - '))

  $('#temporal-recurring-year-range-value').text('1960 - ' + new Date().getFullYear())

  $(document).on 'click', '#temporal-recurring-submit', ->
    year_range = $('#temporal-recurring-year-range-value').text().split(' - ')
    start_datetime = year_range[0] + '-' + $('#temporal-recurring #temporal_start').val().replace(' ','T') + 'Z'
    stop_datetime = year_range[1] + '-' + $('#temporal-recurring #temporal_stop').val().replace(' ','T') + 'Z'

    # find day of the year selected
    one_day = 1000 * 60 * 60 * 24
    start_date_year = new Date( new Date(start_datetime).getFullYear(), 0, 0)
    stop_date_year = new Date( new Date(stop_datetime).getFullYear(), 0, 0)
    start_day = Math.floor((new Date(start_datetime) - start_date_year) / one_day)
    stop_day = Math.floor((new Date(stop_datetime) - stop_date_year) / one_day)

    query.temporal_recurring([start_datetime, stop_datetime, start_day, stop_day])

  $(document).on 'click', '#clear_temporal_start', ->
    $('#temporal_start').val('')
    query.temporal_start('')

  $(document).on 'click', '#clear_temporal_stop', ->
    $('#temporal_stop').val('')
    query.temporal_stop('')
