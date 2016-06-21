$(document).on 'keypress', '#keywords', (e) ->
  if(e.which == 13)
    $(this).blur()
    e.preventDefault()
