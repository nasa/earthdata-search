
ns = @edsc.models.ui

ns.Preferences = do (ko
                     getJSON = jQuery.getJSON
                     doPost = jQuery.post
                     help = @edsc.help
                     ) ->

  class Preferences
    constructor: (@user) ->
      # Default Preferences
      @showTour = ko.observable(true)

      @getPreferences()

    getPreferences: =>
      console.log "Load site preferences"
      prefs = xhr = getJSON '/users/site_preferences', (data, status, xhr) =>
        console.log data
        @fromJson(data) if data?

        $(window).trigger 'preferencesloaded'

    setPreferences: =>
      xhr = doPost '/users/site_preferences', {site_preferences: @serialize()}, (response) =>
        @fromJson(response)

    fromJson: (jsonObj) =>
      if jsonObj
        @showTour(jsonObj.show_tour == "true") if jsonObj.show_tour

    serialize: =>
      json =
        show_tour: @showTour()

    startTour: ->
      # this help is undefined
      help.startTour()

    hideTour: =>
      @showTour(false)
      @setPreferences()

  exports = Preferences
