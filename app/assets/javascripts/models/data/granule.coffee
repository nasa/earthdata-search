@edsc.models.data.Granule = do (ko
                                DetailsModel = @edsc.models.DetailsModel
                                extend = $.extend
                                scalerUrl = @edsc.config.browseScalerUrl
                                ajax = @edsc.util.xhr.ajax
                                ) ->

  class Granule extends DetailsModel
    constructor: (jsonData) ->
      extend(this, jsonData)
      @details = @asyncComputed({}, 100, @_computeGranuleDetails, this)
      @detailsLoaded = ko.observable(false)
      @browseError = ko.observable(false)

    edsc_browse_url: (w, h) ->
      w ?= 170
      h ?= w
      "#{scalerUrl}/browse_images/granules/#{@id}?h=#{h}&w=#{w}"

    edsc_full_browse_url: ->
      for link in @links
        return link.href if link.rel.indexOf('browse') != -1
      null

    download_now_url: ->
      return link.href for link in @links when link.rel.indexOf('/data#') != -1 if @links? && @links.length > 0
      '#'

    onThumbError: (granule) ->
      @browseError(true)

    getTemporal: ->
      time_end = @_normalizeTime(@time_end)
      time_start = @_normalizeTime(@time_start)

      return time_start if time_start == time_end
      return time_start unless time_end?
      return time_end unless time_start?

      "<p class=\"temporal-start\">#{time_start}</p><p class=\"temporal-end\">#{time_end}</p>"

    _normalizeTime: (time) ->
      return null unless time?
      time.replace(/([0-9-]+)T([0-9:]+)\.0+Z/, '$1 $2')

    equals: (other) ->
      other.id == @id

    displayName: ->
      if this.producer_granule_id?
        this.producer_granule_id
      else
        this.title

  exports = Granule
