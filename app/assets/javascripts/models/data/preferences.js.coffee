
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
      @doNotShowTourAgain = ko.observable('false')
      @isLoaded = ko.observable(false)
      @load()

    load: ->
      readyDeferred = new $.Deferred()
      this.ready = readyDeferred
      data = window.edscprefs
      window.edscprefs = null

      if data?
        @fromJson(data)
        @isLoaded(true)
      else
        getJSON '/users/site_preferences', (data, status, xhr) =>
          console.log "Loaded site preferences, #{JSON.stringify(data)}"
          @fromJson(data)
          @isLoaded(true)
          readyDeferred.resolve()
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

    serialize: =>
      json =
        show_tour: @showTour()
        doNotShowTourAgain: @doNotShowTourAgain()?.toString()

  exports = Preferences
