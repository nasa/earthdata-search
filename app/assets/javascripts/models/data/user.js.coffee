ns = @edsc.models.data

ns.User = do (ko
              xhrUtil=@edsc.util.xhr
              getJSON=@edsc.util.xhr.getJSON
              ) ->

  class User
    constructor: ->
      @isLoggedIn = ko.observable(false)
      @loginCallback = null

      @loadURS() if window.urs_user?

      @refreshingToken = false

    loadURS: =>
      data = window.urs_user

      @isLoggedIn(true) if data? && data.expires_in?

    logout: =>
      xhr = getJSON "/logout", (data, status, xhr) =>
        @isLoggedIn(false)

    initiateLogin: (url) =>
      window.location.href = url

  exports = User
