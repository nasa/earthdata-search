ns = @edsc.models.data

ns.User = do (ko, doPost=jQuery.post) ->

  class User
    constructor: ->
      @token = ko.observable(null)
      @name = ko.observable(null)
      @username = ko.observable("")
      @password = ko.observable("")
      @errors = ko.observable("")
      @isLoggedIn = ko.computed =>
        @token() && @name()
      @needsLogin = ko.observable(false)
      @loginCallback = null
      @_loadStateFromCookie()

    initiateLogin: =>
      @needsLogin(true)

    cancelLogin: =>
      @clearLogin()

    clearLogin: =>
      @username("")
      @password("")
      @needsLogin(false)

    login: (form) =>
      data =
        token:
          username: @username()
          password: @password()
          client_id: 'EDSC'

      @errors("")

      xhr = doPost "/login", data, (response) =>
        token = response.token
        @token(token.id)
        @name(token.username)
        @loginCallback?()
        @clearLogin()
        @_setCookie("token", @token())
        @_setCookie("username", @name())

      xhr.fail (response, type, reason) =>
        server_error = false
        try
          errors = JSON.parse(response.responseText)
          if errors?.errors?.length > 0
            @errors(errors.errors[0])
          else
            server_error = true
        catch
          server_error = true
        @errors("An error occurred when logging in.  Please retry later.") if server_error

    logout: =>
      @token(null)
      @name(null)
      @_setCookie("token", "")
      @_setCookie("username", "")

    # https://gist.github.com/dmix/2222990
    _setCookie: (name, value) ->
      document.cookie = name + "=" + escape(value)

    _readCookie: (name) ->
      nameEQ = name + "="
      ca = document.cookie.split(";")
      i = 0
      while i < ca.length
        c = ca[i]
        c = c.substring(1, c.length)  while c.charAt(0) is " "
        return c.substring(nameEQ.length, c.length).replace(/\"/g, '')  if c.indexOf(nameEQ) is 0
        i++
      null

    _loadStateFromCookie: =>
      @token(@_readCookie("token"))
      @name(@_readCookie("username"))

    loggedIn: (action) ->
      if @isLoggedIn()
        action()
      else
        @loginCallback = =>
          @loginCallback = null
          action()

        @needsLogin(true)


  exports = User