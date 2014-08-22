ns = @edsc.models

ns.DetailsModel = do (ko
                      KnockoutModel = @edsc.models.KnockoutModel
                      ajax = @edsc.util.xhr.ajax
                      ) ->
  class DetailsModel extends KnockoutModel

    _computeGranuleDetails: ->
      @_computeDetails('granule')

    _computeDatasetDetails: ->
      @_computeDetails('dataset')

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
            details.summaryData = this if type == 'dataset'
            @details(details)
            @detailsLoaded(true)

  exports = DetailsModel
