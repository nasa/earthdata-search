
ns = @edsc.models.data

ns.Preferences = do (ko
                     getJSON = jQuery.getJSON
                     doPost = jQuery.post
                     ) ->

  class Preferences
    constructor: (@user) ->
      # Default Preferences
      @showTour = ko.observable(true)

      @load()

    load: ->
      getJSON '/users/site_preferences', (data, status, xhr) =>
        console.log "Loaded site preferences", data
        @fromJson(data) if data?

        $(window).trigger 'preferencesloaded'
      null

    save: ->
      console.log 'Saving preferences'
      doPost '/users/site_preferences', {site_preferences: @serialize()}, @fromJson
      null

    fromJson: (jsonObj) =>
      if jsonObj
        @showTour(jsonObj.show_tour == "true") if jsonObj.show_tour

    serialize: =>
      json =
        show_tour: @showTour()

  exports = Preferences
