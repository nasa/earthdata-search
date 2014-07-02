@edsc.models.data.Granule = do (ko
                                KnockoutModel = @edsc.models.KnockoutModel
                                extend = $.extend
                                scalerUrl = @edsc.config.browseScalerUrl
                                ajax = jQuery.ajax
                                ) ->

  class Granule extends KnockoutModel
    constructor: (jsonData) ->
      extend(this, jsonData)
      @details = @asyncComputed({}, 100, @_computeDetails, this)
      @detailsLoaded = ko.observable(false)

    _computeDetails: ->
      id = @id
      path = "/granules/#{id}.json"
      console.log("Request #{path}", this)
      ajax
        dataType: 'json'
        url: path
        retry: => @_computeDetails()
        success: (data) =>
          details = data['granule']
          @details(details)
          @detailsLoaded(true)

    edsc_browse_url: (w, h) ->
      w ?= 170
      h ?= w
      "#{scalerUrl}/#{@id}?h=#{h}&w=#{w}"

    edsc_full_browse_url: ->
      for link in @links
        return link.href if link.rel.indexOf('browse') != -1
      null

    getTemporal: ->
      time_end = @_normalizeTime(@time_end)
      time_start = @_normalizeTime(@time_start)

      return time_start if time_start == time_end
      return time_start unless time_end?
      return time_end unless time_start?

      "#{time_start} to #{time_end}"

    _normalizeTime: (time) ->
      return null unless time?

      time.replace(/\.0+Z/, 'Z')

    equals: (other) ->
      other.id == @id

  exports = Granule
