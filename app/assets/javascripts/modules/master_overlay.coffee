$(document).on 'click', '.master-overlay-main li.panel-list-item', ->
  $(this).closest('.master-overlay').toggleClass('is-master-overlay-details-visible')
  return false;

$(document).on 'click', '.master-overlay-details-close', ->
  $(this).closest('.master-overlay').toggleClass('is-hidden')
  $(this).closest('.master-overlay').toggleClass('is-master-overlay-details-visible')
  return false;

$(document).on 'click', '.master-overlay-show-main', ->
  $(this).closest('.master-overlay').toggleClass('is-master-overlay-details-visible')
  return false;

$(document).on 'click', '.master-overlay-parent .master-overlay-close', ->
  $(this).closest('.master-overlay').toggleClass('is-master-overlay-parent-hidden')
  return false;

$(document).on 'click', '.master-overlay-main .master-overlay-close', ->
  $(this).closest('.master-overlay').toggleClass('is-hidden')
  return false;

$(document).on 'click', '.master-overlay-show', ->
  id = this.href.split('#')[1]
  $('#' + id).removeClass('is-hidden').removeClass('is-master-overlay-parent-hidden')
  return false;

  $(document).on 'transitionend', '.master-overlay-parent, .master-overlay-main', ->
  console.log 'Overlay animation ended'

resizeOverlayContent = ->

$(window).on 'load resize', ->
  # When the window is first loaded or later resized, update the master overlay content
  # boxes to have a height that stretches to the bottom of their parent.  It would
  # be awesome to do this in CSS, but I don't know that it's possible without
  # even uglier results
  $('.master-overlay-content').each ->
    $this = $ this
    $this.height($this.parent().height() - $this.offset().top - 40)
