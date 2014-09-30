
ns = @edsc.models.data

ns.Preferences = do (ko
                     window
                     getJSON = @edsc.util.xhr.getJSON
                     doPost = @edsc.util.xhr.post
                     ) ->

  class Preferences
    constructor: () ->
      # Default Preferences
      @showTour = ko.observable(true)
      @dismissedEvents = ko.observableArray([])
      @isLoaded = ko.observable(false)
      @showSplash = ko.observable(true)

      @load()
      @loadSplash()

    load: ->
      data = window.edscprefs
      window.edscprefs = null

      if data?
        @fromJson(data)
      else
        getJSON '/users/site_preferences', (data, status, xhr) =>
          console.log "Loaded site preferences, #{JSON.stringify(data)}"

          @fromJson(data)
      null

    onload: (fn) ->
      ko.computed
        read: =>
          @isLoaded()
        disposeWhen: =>
          isLoaded = @isLoaded()
          fn(this) if isLoaded
          isLoaded
      null


    save: ->
      serialized = @serialize()
      console.log "Saving site preferences, #{JSON.stringify(serialized)}"
      doPost '/users/site_preferences', {site_preferences: serialized}
      null

    fromJson: (jsonObj) =>
      return unless jsonObj?
      @showTour(jsonObj.show_tour != 'false')
      @dismissedEvents(jsonObj.dismissed_events ? [])
      @showSplash(jsonObj.show_splash != 'false')

    serialize: =>
      json =
        show_tour: @showTour()
        dismissed_events: @dismissedEvents()
        show_splash: @showSplash()

    loadSplash: =>
      host = document.location.host
      # Comment out unless statement to see splash page in DEV
      unless host == 'https://search.sit.earthdata.nasa.gov/' ||
            host == 'https://search.uat.earthdata.nasa.gov/'
        @hideSplash()

      referrer = document.referrer
      if @showSplash() && (referrer == 'https://search.sit.earthdata.nasa.gov/' ||
                          referrer == 'https://search.uat.earthdata.nasa.gov/' ||
                          referrer == 'http://edsc.dev/')
        @hideSplash()

      @isLoaded(true)


    hideSplash: =>
      @showSplash(false)
      @save()

  exports = Preferences
