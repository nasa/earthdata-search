query = window.edsc.models.searchModel.query

$(document).ready ->
  $('#temporal_start').datetimepicker({
    format: 'Y-m-d H:i:s',
    onChangeDateTime: (dp,$input) ->
      query.temporal_start($input.val().replace(' ','T') + 'Z')
  })

  $('#temporal_stop').datetimepicker({
    format: 'Y-m-d H:i:s',
    onChangeDateTime: (dp,$input) ->
      query.temporal_stop($input.val().replace(' ','T') + 'Z')
  })

  $(document).on 'click', '#clear_temporal_start', ->
    $('#temporal_start').val('')
    query.temporal_start('')

  $(document).on 'click', '#clear_temporal_stop', ->
    $('#temporal_stop').val('')
    query.temporal_stop('')
