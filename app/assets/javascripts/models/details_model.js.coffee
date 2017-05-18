ns = @edsc.models

ns.DetailsModel = do (ko
                      KnockoutModel = @edsc.models.KnockoutModel
                      ajax = @edsc.util.xhr.ajax
                      $=jQuery
                      document
                      ) ->
  class DetailsModel extends KnockoutModel

    _computeGranuleDetails: ->
      @_computeDetails('granule')

    _computeCollectionDetails: ->
      @_computeDetails('collection')

    _computeDetails: (type) ->
      id = @id
      if id?
        path = "/#{type}s/#{id}.json"
        # wait for /collections.json
        _timer = setInterval (=>
          unless window.edsc.util.xhr.hasPending()
            console.log("Request #{path}", this)
            clearTimeout(_timer)
            ajax
              dataType: 'json'
              url: path
              retry: => @_computeDetails(type)
              success: (data) =>
                details = data[type]
                details.summaryData = this if type == 'collection'
                @details(details)
                @detailsLoaded(true)
                desc = $('.long-paragraph')
                if desc.height() < 142 # refer to collection_details.css.scss .long-paragraph
                  $('.description-toggle').hide()
        ), 0

  exports = DetailsModel
