ns = @edsc.models.data

ns.User = do (ko
              doPost=jQuery.post
              getJSON=jQuery.getJSON
              cookieUtil=@edsc.util.cookies
              ) ->

  class User
    constructor: ->
      @token = ko.observable(null)
      @name = ko.observable(null)
      @username = ko.observable("")
      @password = ko.observable("")
      @email = ko.observable("")
      @errors = ko.observable("")
      @message = ko.observable("")
      @isLoggedIn = ko.computed =>
        @token()?.length > 0 && @name()?.length > 0
      @needsLogin = ko.observable(false)
      @needsUsername = ko.observable(false)
      @needsPassword = ko.observable(false)
      @loginCallback = null
      @_loadStateFromCookie()

    initiateLogin: =>
      @errors("")
      @message("")
      @needsLogin(true)

    cancelLogin: =>
      @clearLogin()

    clearLogin: =>
      @username("")
      @password("")
      @needsLogin(false)

    beginLogin: =>
      @needsUsername(false)
      @needsPassword(false)

    beginPasswordRecovery: =>
      @needsUsername(false)
      @needsPassword(true)

    beginUsernameRecovery: =>
      @needsUsername(true)
      @needsPassword(false)

    processLogin: (form) =>
      # Fix chrome autocomplete issues
      @username(document.getElementById('username')?.value) unless @username()?.length > 0
      @password(document.getElementById('password')?.value) unless @password()?.length > 0
      @email(document.getElementById('email')?.value) unless @email()?.length > 0

      @errors("")
      @message("")

      if @needsUsername()
        @recoverUsername()
      else if @needsPassword()
        @recoverPassword()
      else
        @login()

    recoverUsername: ->
      data =
        email: @email()

      xhr = doPost '/users/username_recall', data, (response) =>
        @beginLogin()
        @message("Username information has been sent to #{@email()}.")
      xhr.fail(@_onXhrFail)

    recoverPassword: ->
      data =
        username: @username()
        email: @email()

      xhr = doPost '/users/password_reset', data, (response) =>
        @beginLogin()
        @message("The password for #{@username()} has been reset.  Information on logging in has been sent to #{@email()}.")
      xhr.fail(@_onXhrFail)

    login: ->
      data =
        token:
          username: @username()
          password: @password()
          client_id: 'EDSC'

      xhr = doPost "/login", data, (response) =>
        token = response.token
        unless token?
          console.log("Error logging in")
          return
        @token(token.id)
        @name(token.username)
        @loginCallback?()
        @clearLogin()
        cookieUtil.setCookie("token", @token())
        cookieUtil.setCookie("name", @name())

      xhr.fail(@_onXhrFail)

    _onXhrFail: (response, type, reason) =>
      server_error = false
      console.log response.responseText
      try
        errors = JSON.parse(response.responseText)?.errors
        error = null
        # Clean up the inconsistent mess that comes back from echo-rest
        if errors?.length > 0
          error = errors[0].replace('emailAddress', 'email')
                           .replace('Parameter ', '')
          error = error.charAt(0).toUpperCase() + error.slice(1);
          @errors(error)
        else
          server_error = true
      catch
        server_error = true
      @errors("An error occurred when logging in.  Please retry later.") if server_error

    logout: =>
      xhr = getJSON "/logout", (data, status, xhr) =>
        @token(null)
        @name(null)
        cookieUtil.setCookie("token", "")
        cookieUtil.setCookie("name", "")
        @clearLogin()

    _loadStateFromCookie: =>
      @token(cookieUtil.readCookie("token"))
      @name(cookieUtil.readCookie("name"))

    loggedIn: (action) ->
      if @isLoggedIn()
        action()
      else
        @loginCallback = =>
          @loginCallback = null
          action()

        @needsLogin(true)

  exports = User
