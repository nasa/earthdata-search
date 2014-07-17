ns = @edsc.models.data

ns.User = do (ko
              doPost=jQuery.post
              getJSON=jQuery.getJSON
              cookieUtil=@edsc.util.cookies
              ) ->

  class User
    constructor: ->
      @access_token = ko.observable(null)
      @refresh_token = ko.observable(null)
      @expires = ko.observable(null)
      @name = ko.observable(null)
      # @username = ko.observable("")
      # @password = ko.observable("")
      # @email = ko.observable("")
      @errors = ko.observable("")
      @message = ko.observable("")
      @isLoggedIn = ko.computed =>
        @access_token()?.length > 0 && @name()?.length > 0
      @needsLogin = ko.observable(false)
      @needsUsername = ko.observable(false)
      @needsPassword = ko.observable(false)
      @loginCallback = null
      @_loadStateFromCookie()

      # I dont think this will reload the user on ajax requests
      @loadURS() if window.urs_user?

    loadURS: =>
      data = window.urs_user
      window.urs_user = null

      if data?
        console.log('URS User: ' + JSON.stringify(data))
        @name(data.username)
        @access_token(data.access_token)
        @refresh_token(data.refresh_token)
        @expires(Date.now() + (parseInt(data.expires_in) * 1000 ))

        cookieUtil.setCookie("access_token", @access_token())
        cookieUtil.setCookie("refresh_token", @refresh_token())
        cookieUtil.setCookie("name", @name())
        cookieUtil.setCookie("expires", @expires())
      else
        console.log('No URS user data')


    logout: =>
      xhr = getJSON "/logout", (data, status, xhr) =>
        @access_token(null)
        @refresh_token(null)
        @name(null)
        @expires(null)

    _loadStateFromCookie: =>
      @access_token(cookieUtil.readCookie("access_token"))
      @refresh_token(cookieUtil.readCookie("refresh_token"))
      @name(cookieUtil.readCookie("name"))
      @expires(cookieUtil.readCookie("expires"))

    loggedIn: (action) ->
      if @isLoggedIn()
        action()
      else
        @loginCallback = =>
          @loginCallback = null
          action()

        @needsLogin(true)

    initiateLogin: (url) =>
      console.log("URL: " + url)
      old_url = window.location.href
      console.log("Old URL: " + old_url)
      window.location.href = url
      # @errors("")
      # @message("")
      # @needsLogin(true)

    # cancelLogin: =>
    #   @clearLogin()

    # clearLogin: =>
    #   @username("")
    #   @password("")
    #   @needsLogin(false)

    # beginLogin: =>
    #   @needsUsername(false)
    #   @needsPassword(false)

    # beginPasswordRecovery: =>
    #   @needsUsername(false)
    #   @needsPassword(true)

    # beginUsernameRecovery: =>
    #   @needsUsername(true)
    #   @needsPassword(false)

    # processLogin: (form) =>
    #   # Fix chrome autocomplete issues
    #   @username(document.getElementById('username')?.value) unless @username()?.length > 0
    #   @password(document.getElementById('password')?.value) unless @password()?.length > 0
    #   @email(document.getElementById('email')?.value) unless @email()?.length > 0
    #
    #   @errors("")
    #   @message("")
    #
    #   if @needsUsername()
    #     @recoverUsername()
    #   else if @needsPassword()
    #     @recoverPassword()
    #   else
    #     @login()

    # recoverUsername: ->
    #   data =
    #     email: @email()
    #
    #   xhr = doPost '/users/username_recall', data, (response) =>
    #     @beginLogin()
    #     @message("Username information has been sent to #{@email()}.")
    #   xhr.fail(@_onXhrFail)

    # recoverPassword: ->
    #   data =
    #     username: @username()
    #     email: @email()
    #
    #   xhr = doPost '/users/password_reset', data, (response) =>
    #     @beginLogin()
    #     @message("The password for #{@username()} has been reset.  Information on logging in has been sent to #{@email()}.")
    #   xhr.fail(@_onXhrFail)

    # login: ->
    #   data =
    #     token:
    #       username: @username()
    #       password: @password()
    #       client_id: 'EDSC'
    #
    #   xhr = doPost "/login", data, (response) =>
    #     token = response.token
    #     unless token?
    #       console.log("Error logging in")
    #       return
    #     @token(token.id)
    #     @name(token.username)
    #     @loginCallback?()
    #     @clearLogin()
    #     cookieUtil.setCookie("token", @token())
    #     cookieUtil.setCookie("name", @name())
    #
    #   xhr.fail(@_onXhrFail)

    # _onXhrFail: (response, type, reason) =>
    #   server_error = false
    #   console.log response.responseText
    #   try
    #     errors = JSON.parse(response.responseText)?.errors
    #     error = null
    #     # Clean up the inconsistent mess that comes back from echo-rest
    #     if errors?.length > 0
    #       error = errors[0].replace('emailAddress', 'email')
    #                        .replace('Parameter ', '')
    #       error = error.charAt(0).toUpperCase() + error.slice(1);
    #       @errors(error)
    #     else
    #       server_error = true
    #   catch
    #     server_error = true
    #   @errors("An error occurred when logging in.  Please retry later.") if server_error


  exports = User
