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
      # if not logged in get preferences from cookies
      # if logged in get preferences from Rails
      # if both exist, merge?
      # if neither exist, use defaults


      if @user.isLoggedIn()
        console.log "Load site preferences"
        prefs = xhr = getJSON '/users/site_preferences', (data, status, xhr) =>
          console.log data
          @fromJson(data) if data?

    setPreferences: =>
      # if not logged in set preferences in cookies
      # if logged in set preferences in database and delete cookies
      
      xhr = doPost '/users/site_preferences', {preferences: @serialize()}, (response) =>
        @fromJson(response.text)

    fromJson: (jsonObj) =>
      @show_tour(jsonObj.show_tour) if jsonObj.show_tour

    serialize: =>
      json =
        show_tour: @show_tour()


  exports = Preferences
