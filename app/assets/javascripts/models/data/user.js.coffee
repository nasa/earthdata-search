ns = @edsc.models.data

ns.User = do (ko
              getJSON=@edsc.util.xhr.getJSON
              ) ->

  class User
    constructor: ->
      @name = ko.observable(null)
      @isLoggedIn = ko.observable(false)
      @loginCallback = null

      @loadURS() if window.urs_user?

      @refreshingToken = false

    loadURS: =>
      data = window.urs_user

      @isLoggedIn(true) if data? && data.expires?

    logout: =>
      xhr = getJSON "/logout", (data, status, xhr) =>
        @isLoggedIn(false)

    initiateLogin: (url) =>
      window.location.href = url

  exports = User
