//= require typeahead-0.9.3/typeahead

do ($=jQuery, currentPage = window.edsc.models.page.current) ->

  $(document).ready ->
    $placenameInputs = $('.autocomplete-placenames')

    $placenameInputs.typeahead
      name: 'keywords'
      remote: '/placenames?q=%QUERY'

    # When the user selects a typeahead value,
    # TODO: Upgrade to typeahead-0.10 when available and verify that typeahead:cursorchanged triggers with arrow keys
    $placenameInputs.on 'typeahead:selected typeahead:autocompleted typeahead:cursorchanged', (event, datum) ->
      {placename, ref, value} = datum
      currentPage.query.keywords(value)

      $.getJSON "/placenames/#{ref}", (data) ->
        # Avoid overwriting our own value with the subscription below
        currentPage.query.placename(null)
        currentPage.query.spatial(data.spatial)
        currentPage.query.placename(placename)

    currentPage.query.keywords.subscribe (newValue) ->
      $('.autocomplete-placenames').typeahead('setQuery', newValue ? "")

    currentPage.query.spatial.subscribe (newValue) ->
      currentPlacename = currentPage.query.placename()
      for input in $('.autocomplete-placenames')
        if input.value.indexOf(currentPlacename) != -1
          input.value = input.value.replace(currentPlacename, '')
