
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
      @doNotShowTourAgain = ko.observable(false)
      @dismissedEvents = ko.observableArray([])
      @isLoaded = ko.observable(false)

      @load()

    load: ->
      data = window.edscprefs
      window.edscprefs = null

      if data?
        @fromJson(data)
        @isLoaded(true)
      else
        $.ajax '/users/site_preferences',
          type: 'GET'
          dataType: 'json',
          async: false,
          context: this,
          data: data,
          success: (data, textStatus, jqXHR) ->
            console.log "Loaded site preferences, #{JSON.stringify(data)}"
            @fromJson(data)
            @isLoaded(true)
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
      @doNotShowTourAgain(jsonObj.doNotShowTourAgain)
      @dismissedEvents(jsonObj.dismissed_events ? [])

    serialize: =>
      json =
        show_tour: @showTour()
        doNotShowTourAgain: if @doNotShowTourAgain() then 'true' else 'false'
        dismissed_events: @dismissedEvents()

  exports = Preferences
