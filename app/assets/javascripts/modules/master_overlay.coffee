$(document).on 'click', '.master-overlay-main li.panel-list-item', (e) ->
  if $(e.target).closest('a').length == 0
    $(this).closest('.master-overlay').toggleClass('is-master-overlay-details-visible')
  false

$(document).on 'click', '.master-overlay-show-main', ->
  $(this).closest('.master-overlay').toggleClass('is-master-overlay-details-visible')
  false

$(document).on 'click', '.master-overlay-main .master-overlay-close', ->
  $(this).closest('.master-overlay').toggleClass('is-hidden')
  false

$(document).on 'click', '.master-overlay-toggle-parent, .master-overlay-parent .master-overlay-close', ->
  $overlay = $(this).closest('.master-overlay')
  $overlay.toggleClass('is-master-overlay-parent-hidden')
  false

$(document).on 'click', '.temporal-dropdown-button', ->
  $(this).parent().toggleClass('open')

$(document).on 'click', '.master-overlay-show', ->
  id = this.href.split('#')[1]
  $('#' + id).removeClass('is-hidden')
  false

$(window).on 'load resize', ->
  # When the window is first loaded or later resized, update the master overlay content
  # boxes to have a height that stretches to the bottom of their parent.  It would
  # be awesome to do this in CSS, but I don't know that it's possible without
  # even uglier results
  $('.master-overlay-content').each ->
    $this = $ this
    $this.height($this.parents('.main-content').height() - $this.offset().top - 40)

# Initialize Expand/Collapse Facets
$(document).ready ->
  $('.collapse').collapse()

# Expand/Collapse Facets
$(document).on 'click', '.collapse-link', ->
  $($(this).find('a').attr("data-target")).collapse('toggle')
  $(this).find('i').toggleClass('fa-caret-down fa-caret-up')
