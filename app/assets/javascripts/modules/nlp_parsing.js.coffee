do ($=jQuery, currentPage = window.edsc.models.page.current, ajax=@edsc.util.xhr.ajax, hasPending=@edsc.util.xhr.hasPending) ->

  immediateReenter = null
  $(document).ready ->
    $nlpInput = $('.nlp-parsing')
    typingTimer = null
    timeoutInterval = 700
    $nlpInput.on 'input paste cut', (event) ->
      clearTimeout(typingTimer)
      typingTimer = setTimeout(_parseSearchText, timeoutInterval)

    $nlpInput.on 'keydown', (event) ->
      clearTimeout(typingTimer)
      _parseSearchText(event) if event.which == 13

    $('body').on 'click', 'label', (event) ->
      immediateReenter = false
      true
    $('body').on 'click', 'a', (event) ->
      immediateReenter = false
      true

    _parseSearchText = (e) ->
      if immediateReenter
        immediateReenter = ($nlpInput.val() != currentPage.query.originalKeywords() && $nlpInput.val() != '' && currentPage.query.originalKeywords() != '')
      else
        immediateReenter = false

      previousKeyword = currentPage.query.originalKeywords()

      query = $nlpInput.val()
      currentPage.query.originalKeywords(query)
      ajax
        dataType: 'json'
        url: "/extract_filters?q=#{query}&rerun=#{immediateReenter}&previous_q=#{previousKeyword}"
        success: (data) =>
          _applyParsedText(data)
      immediateReenter = true

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

    readOriginalKeywords = ->
      delayUpdateTimer = setInterval((=>
        unless hasPending()
          clearTimeout(delayUpdateTimer)
          $keywords = $('#keywords')
          currentValue = $keywords.val()
          newValue = currentPage.query.originalKeywords() || currentPage.query.keywords()
          if newValue == "" || newValue == null
            currentPage.query.originalKeywords(currentValue)
            currentPage.query.keywords(currentValue)
          else
            $keywords.val(newValue)
      ), 0)

    readSpatial = (newValue) ->
      currentSpatial = currentPage.query.spatial()
      currentSpatial = newValue ? "" unless currentSpatial == newValue


    readOriginalKeywords()
    readSpatial(currentPage.query.spatial())

    currentPage.query.originalKeywords.subscribe readOriginalKeywords
    currentPage.query.spatial.subscribe readSpatial
