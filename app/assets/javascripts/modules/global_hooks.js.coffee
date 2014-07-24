do ($ = jQuery, config = @edsc.config) ->

  $(document).on 'click', 'a[data-pulse]', ->
    $dest = $($(this).attr('data-pulse'))
    $dest.animate(color: '#00ffff').animate(color: 'inherit')

  # Remove buttons in tables remove their rows
  $(document).on 'click', 'tr a[title=remove]', ->
    $(this).closest('tr').remove()
    if location.href.indexOf('projects') != -1
      $('.data-access-content').html('<p>No saved projects</p>')

  # flash the green save icon
  $(document).on 'edsc.saved', ->
    check = $('.save-success')
    check.show()
    setTimeout((-> check.fadeOut()), config.defaultAnimationDurationMs)
