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
        console.log("Request #{path}", this)
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

  exports = DetailsModel
