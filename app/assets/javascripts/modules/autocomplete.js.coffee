do ($=jQuery, currentPage = window.edsc.models.page.current, ajax=@edsc.util.xhr.ajax) ->

  $(document).ready ->
    $placenameInputs = $('.autocomplete-placenames')

#    engine = new Bloodhound
#      name: 'extract_filters'
#      remote:
#        url: '/extract_filters?q=%QUERY'
#        wildcard: '%QUERY'
##        ajax:
##          success: (data) =>
##            console.log "------------- ", data
##            console.log "============= ", data
##              if data.edscSpatial?.query && currentPage.query.spatial() != data.edscSpatial?.query
##              $placenameInputs.trigger 'typeahead:selected',  data
##        url: '/placenames?q=%QUERY'
#        ajax: success: (data) ->
#          console.log "---- success"
#          if (data.edscSpatial? || data.edscTemporal?) && currentPage.query.spatial() != data.edscSpatial.query
#            $placenameInputs.trigger 'typeahead:selected', data
#      datumTokenizer: -> Bloodhound.tokenizers.whitespace(d.val)
#      queryTokenizer: Bloodhound.tokenizers.whitespace
#
#    engine.initialize()
#
#    uiOpts =
#      hint: false
#      highlight: true
#      minLength: 1
#    dsOpts =
#      name: 'keywords'
#      source: engine.ttAdapter()
#    $placenameInputs.typeahead(uiOpts, dsOpts)
#
#    currentSpatial = null
#
#    # When the user selects a typeahead value,
#    # TODO: Upgrade to typeahead-0.10 when available and verify that typeahead:cursorchanged triggers with arrow keys
#    $placenameInputs.on 'typeahead:autocompleted typeahead:selected', (event, datum) ->
#      console.log "==-=-=-=---- ", datum
#      {edscSpatial, edscTemporal, keyword} = datum
#      currentPage.query.keywords(keyword)
#      console.log "==-=-=-=---- 11 "
#      #      currentPage.query.placename(null)
#      currentPage.query.spatial(edscSpatial?.query)
#      currentPage.query.temporal.applied.queryCondition(edscTemporal?.query)
#      console.log "==-=-=-=---- 20 "
#
#      #      currentPage.query.temporal(edscTemporal)
#      #      currentPage.query.placename(placename)
#      if edscSpatial
#        console.log "==-=-=-=---- 25 "
#        currentSpatial = edscSpatial.query
#        console.log "==-=-=-=---- 33 "
#
#        p1 = [edscSpatial.bbox.swPoint.latitude, edscSpatial.bbox.swPoint.longitude]
#        p2 = [edscSpatial.bbox.nePoint.latitude, edscSpatial.bbox.nePoint.longitude]
#        $('#map').data('map').map.fitBounds([p1,p2])
#        console.log "==-=-=-=---- 44 "
#      console.log "==-=-=-=---- 55 "

    typingTimer = null
    timeoutInterval = 500
    $placenameInputs.on 'keyup', (event) ->
      clearTimeout(typingTimer)
      typingTimer = setTimeout(_parseSearchText, timeoutInterval)

    $placenameInputs.on 'keydown', (event) ->
      clearTimeout(typingTimer)

    _parseSearchText = (e) ->
      query = $placenameInputs.val()
      ajax
        dataType: 'json'
        url: "/extract_filters?q=#{query}"
        success: (data) =>
          _applyParsedText(data)

    _applyParsedText = (data) ->
      {edscSpatial, edscTemporal, keyword} = data
      currentPage.query.keywords(keyword)
      $('#keywords').val(keyword) if keyword != $('#keywords').val()

      currentPage.query.spatial(edscSpatial?.query)
      currentPage.query.temporal.applied.queryCondition(edscTemporal?.query)

      if edscSpatial
        currentSpatial = edscSpatial.query

        p1 = [edscSpatial.bbox.swPoint.latitude, edscSpatial.bbox.swPoint.longitude]
        p2 = [edscSpatial.bbox.nePoint.latitude, edscSpatial.bbox.nePoint.longitude]
        $('#map').data('map').map.fitBounds([p1,p2])
#      console.log "==-=-=-=---- keyup "
#      newValue = $(this).typeahead('val')
#      query = currentPage.query
#      currentValue = query.keywords()
#      unless newValue == currentValue
#        query.keywords(newValue)

    readKeywords = (newValue) ->
      console.log "---- readKeywords", newValue
      $keywords = $('#keywords')
      currentValue = $keywords.val()
      unless newValue == currentValue
        $keywords.val(newValue ? "")

    readSpatial = (newValue) ->
      console.log "---- readSpatial", newValue
      currentSpatial = newValue if currentSpatial == null


    readKeywords(currentPage.query.keywords())
    readSpatial(currentPage.query.spatial())

    currentPage.query.keywords.subscribe readKeywords
    currentPage.query.spatial.subscribe readSpatial

    # TODO: blur isn't a good event to listen to. It should get triggered
    #       when the keyword changes.
    $placenameInputs.on 'blur', (e) ->
      console.log "--------------- blur"
      _parseSearchText(e)

