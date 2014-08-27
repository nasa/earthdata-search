ns = @edsc.models.data

ns.User = do (ko
              xhrUtil=@edsc.util.xhr
              getJSON=@edsc.util.xhr.getJSON
              ) ->

  class User
    constructor: ->
      @isLoggedIn = ko.observable(false)
      @loginCallback = null

      @loadTokenExpires() if window.tokenExpires?

      @refreshingToken = false

    loadTokenExpires: =>
      data = window.tokenExpires

      @isLoggedIn(true) if data? && data.expires_in?

    logout: =>
      xhr = getJSON "/logout", (data, status, xhr) =>
        @isLoggedIn(false)

    initiateLogin: (url) =>
      window.location.href = url

  exports = User
