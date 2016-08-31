do ($=jQuery, currentPage = window.edsc.models.page.current, ajax=@edsc.util.xhr.ajax) ->

  $(document).ready ->
    $nlpInput = $('.nlp-parsing')
    typingTimer = null
    timeoutInterval = 500
    $nlpInput.on 'input paste cut', (event) ->
      clearTimeout(typingTimer)
      typingTimer = setTimeout(_parseSearchText, timeoutInterval)

    $nlpInput.on 'keydown', (event) ->
      clearTimeout(typingTimer)
      _parseSearchText(event) if event.which == 13

    _parseSearchText = (e) ->
      query = $nlpInput.val()
      currentPage.query.originalKeywords(query)
      ajax
        dataType: 'json'
        url: "/extract_filters?q=#{query}"
        success: (data) =>
          _applyParsedText(data)

    _applyParsedText = (data) ->
      {edscSpatial, edscTemporal, keyword} = data
      currentPage.query.keywords(keyword)
      currentPage.query.spatial(edscSpatial.query) if edscSpatial?
      currentPage.query.temporal.applied.queryCondition(edscTemporal.query) if edscTemporal?

      if edscSpatial
        currentSpatial = edscSpatial.query

        p1 = [edscSpatial.bbox.swPoint.latitude, edscSpatial.bbox.swPoint.longitude]
        p2 = [edscSpatial.bbox.nePoint.latitude, edscSpatial.bbox.nePoint.longitude]
        $('#map').data('map').map.fitBounds([p1,p2])

    readOriginalKeywords = (newValue) ->
      $keywords = $('#keywords')
      currentValue = $keywords.val()
      $keywords.val(newValue ? "") unless newValue == currentValue

    readSpatial = (newValue) ->
      currentSpatial = currentPage.query.spatial()
      currentSpatial = newValue ? "" unless currentSpatial == newValue


    readOriginalKeywords(currentPage.query.originalKeywords())
    readSpatial(currentPage.query.spatial())

    currentPage.query.originalKeywords.subscribe readOriginalKeywords
    currentPage.query.spatial.subscribe readSpatial