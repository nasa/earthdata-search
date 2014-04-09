#= require models/data/xhr_model

ns = @edsc.models.ui

ns.Preferences = do (ko
                     XhrModel = @edsc.models.data.XhrModel
                     getJSON = jQuery.getJSON
                     doPost = jQuery.post
                     extend = $.extend
                     cookieUtil = @edsc.util.cookies
                     ) ->

  class Preferences
    constructor: (@user) ->
      # Default Preferences
      @show_tour = ko.observable(true)

      @getPreferences()

    getPreferences: =>
      console.log "Load site preferences"
      prefs = xhr = getJSON '/users/site_preferences', (data, status, xhr) =>
        console.log data
        @fromJson(data) if data?

    setPreferences: =>
      xhr = doPost '/users/site_preferences', {site_preferences: @serialize()}, (response) =>
        @fromJson(response)

    fromJson: (jsonObj) =>
      if jsonObj
        @show_tour(jsonObj.show_tour) if jsonObj.show_tour

    serialize: =>
      json =
        show_tour: @show_tour()


  exports = Preferences
