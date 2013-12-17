$(document).ready ->
  $('#temporal_start').datetimepicker({
    format: 'Y-m-d H:i:s',
    onChangeDateTime: (dp,$input) -> 
      alert($input.val())
  })

  $('#temporal_end').datetimepicker({
    format: 'Y-m-d H:i:s'
  })
