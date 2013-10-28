$(document).on 'click', '.master-overlay-parent .master-overlay-close', ->
  $(this).closest('.master-overlay').toggleClass('is-master-overlay-parent-hidden')
  return false;

$(document).on 'click', '.master-overlay-main .master-overlay-close', ->
  $(this).closest('.master-overlay').toggleClass('is-hidden')
  return false;

$(document).on 'click', '.master-overlay-show', ->
  id = this.href.split('#')[1]
  console.log
  $('#' + id).removeClass('is-hidden').removeClass('is-master-overlay-parent-hidden')
  return false;

  $(document).on 'transitionend', '.master-overlay-parent, .master-overlay-main', ->
  console.log 'Overlay animation ended'
