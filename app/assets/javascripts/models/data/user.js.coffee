ns = @edsc.models.data

ns.User = do (ko
              doPost=jQuery.post
              getJSON=jQuery.getJSON
              ) ->

  class User
    constructor: ->
      @expires = ko.observable(null)
      @name = ko.observable(null)
      @errors = ko.observable("")
      @message = ko.observable("")
      @isLoggedIn = ko.computed =>
        @expires() > 0 && @name()?.length > 0
      @needsLogin = ko.observable(false)
      @needsUsername = ko.observable(false)
      @needsPassword = ko.observable(false)
      @loginCallback = null

      @loadURS() if window.urs_user?

      @refreshingToken = false

    loadURS: =>
      data = window.urs_user
      window.urs_user = null

      if data?
        @name(data.username)
        @expires(data.expires)

    logout: =>
      xhr = getJSON "/logout", (data, status, xhr) =>
        @name(null)
        @expires(null)

    loggedIn: (action) ->
      if @isLoggedIn()
        action()
      else
        @loginCallback = =>
          @loginCallback = null
          action()

        @needsLogin(true)

    initiateLogin: (url) =>
      window.location.href = url

    checkToken: (action) =>
      # In the case of multiple xhr requests trying to check the token near the same time,
      # wait until nobody else is checking the token
      continue while @refreshingToken == true

      time = new Date().getTime() / 1000
      if @name()? && @expires()?
        if time > @expires()
          @refreshingToken = true
          console.log 'Refreshing URS Token'
          xhr = getJSON "refresh_token", (data, status, xhr) =>
            if data?
              @name(data.username)
              @expires(data.expires)
              @refreshingToken = false
            action()
        else
          action()
      else
        action()

  exports = User
