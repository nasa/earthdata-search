//= require typeahead-0.9.3/typeahead

do ($=jQuery, searchModel = window.edsc.models.searchModel) ->

  $(document).ready ->
    $placenameInputs = $('.autocomplete-placenames')

    $placenameInputs.typeahead
      name: 'keywords'
      remote: '/placenames?q=%QUERY'

    # When the user selects a typeahead value,
    $placenameInputs.on 'typeahead:selected typeahead:autocompleted', (event, datum) ->
      {placename, ref, value} = datum
      searchModel.query.keywords(value)

      $.getJSON "/placenames/#{ref}", (data) ->
        # Avoid overwriting our own value with the subscription below
        searchModel.query.placename(null)
        searchModel.query.spatial(data.spatial)
        searchModel.query.placename(placename)

    searchModel.query.spatial.subscribe (newValue) ->
      currentPlacename = searchModel.query.placename()
      for input in $('.autocomplete-placenames')
        if input.value.indexOf(currentPlacename) != -1
          input.value = input.value.replace(currentPlacename, '')
