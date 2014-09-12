do ($ = jQuery, config = @edsc.config) ->

  $(document).on 'click', 'a[data-pulse]', ->
    $dest = $($(this).attr('data-pulse'))
    $dest.animate(color: '#00ffff').animate(color: 'inherit')

  # Remove buttons in tables remove their rows
  $(document).on 'click', 'tr a[title="remove"]', ->
    $(this).closest('tr').remove()

  $(document).on 'click', 'tr a[title="Remove Project"]', ->
    $(this).closest('tr').remove()
    if $('tbody tr').length == 0
      $('.data-access-content').html('<p>No saved projects</p>')

  $(document).on 'click', 'a[href="#"]', (e) ->
    e.preventDefault()

  # flash the green save icon
  $(document).on 'edsc.saved', ->
    check = $('.save-success')
    check.show()
    setTimeout((-> check.fadeOut()), config.defaultAnimationDurationMs)

  $(document).on 'focusin.focushack', '*[tabIndex]', ->
    $(this).addClass('has-focus')

  $(document).on 'focusout.focushack', '*[tabIndex]', ->
    $(this).removeClass('has-focus')

  $(document).ready ->
    $(document.body).tooltip({ selector: '[data-tooltip="true"]', placement: 'auto left' });