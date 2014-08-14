ns = @edsc.models.data

ns.User = do (ko
              doPost=jQuery.post
              getJSON=jQuery.getJSON
              cookieUtil=@edsc.util.cookies
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
      time = new Date().getTime() / 1000
      if @name()? && @expires()?
        if time > @expires()
          console.log 'Refreshing URS Token'
          xhr = getJSON "refresh_token", (data, status, xhr) =>
            console.log('URS User: ' + JSON.stringify(data))
            if data?
              @name(data.username)
              @expires(data.expires)
            action()
        else
          action()
      else
        action()

  exports = User
