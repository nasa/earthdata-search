do ($ = jQuery, config = @edsc.config) ->

  $(document).on 'click', 'a[data-pulse]', ->
    $dest = $($(this).attr('data-pulse'))
    $dest.animate(color: '#00ffff').animate(color: 'inherit')

  # Remove buttons in tables remove their rows
  $(document).on 'click', 'tr a[title=remove]', ->
    $(this).closest('tr').remove()

  # flash the green save icon
  $(document).on 'edsc.saved', ->
    save = $('.save-icon')
    check = $('.save-success')
    save.hide()
    check.show()
    setTimeout((-> check.fadeOut()), config.defaultAnimationDurationMs)
    setTimeout((-> save.show()), config.defaultAnimationDurationMs + 400)
