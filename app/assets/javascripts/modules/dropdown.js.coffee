do ($=jQuery) ->
  # TODO: An update to bootstrap will allow us to fix the issue where clicking on
  #       the spatial dropdown doesn't hide the temporal dropdown via
  #       $(event.relatedTarget).hasClass('dropdown-button')
  $(document).on 'hide.bs.dropdown', (event) ->
    event.preventDefault() if $(event.target).hasClass('dropdown-persistent')

  # TODO: Remove this after the bootstrap update mentioned in the previous handler
  # $(document).on 'click', '.dropdown-button', (event) ->
  #   $('.dropdown.open').not($(this).closest('.dropdown')).removeClass('open')

	$(document).on 'click', 'div.temporal-filter, input.temporal-start, input.temporal-stop, div.xdsoft_datetimepicker', (event) ->
		event.stopPropagation()
