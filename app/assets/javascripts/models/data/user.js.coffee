ns = @edsc.models.data

ns.User = do (ko, doPost=jQuery.post, getJSON=jQuery.getJSON) ->

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

      # account fields
      @usernameError = ko.observable(false)
      @passwordError = ko.observable(false)
      @emailError = ko.observable(false)
      @passwordConfirmation = ko.observable("")
      @passwordConfirmationError = ko.observable(false)
      @firstName = ko.observable("")
      @firstNameError = ko.observable(false)
      @lastName = ko.observable("")
      @lastNameError = ko.observable(false)
      @organizationName = ko.observable("")
      @organizationNameError = ko.observable(false)
      @domain = ko.observable("")
      @domainError = ko.observable(false)
      @userType = ko.observable("")
      @userTypeError = ko.observable(false)
      @primaryStudyArea = ko.observable("")
      @primaryStudyAreaError = ko.observable(false)
      @country = ko.observable("")
      @countryError = ko.observable(false)
      @region = ko.computed =>
        if @country() == "United States" then "USA" else "INTERNATIONAL"

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
        @token(token.id)
        @name(token.username)
        @loginCallback?()
        @clearLogin()
        @_setCookie("token", @token())
        @_setCookie("name", @name())

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
        @_setCookie("token", "")
        @_setCookie("name", "")
        @clearLogin()

    # https://gist.github.com/dmix/2222990
    _setCookie: (name, value) ->
      document.cookie = "#{name}=#{escape(value)}; path=/;"

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
      @name(@_readCookie("name"))

    loggedIn: (action) ->
      if @isLoggedIn()
        action()
      else
        @loginCallback = =>
          @loginCallback = null
          action()

        @needsLogin(true)

    createAccount: =>
      @_validateNewAccountForm()
      if @errors()?.length == 0
        xhr = doPost '/users', @_buildUserData(), (response) =>
          @login()
        xhr.fail(@_onCreateFail)

    _onCreateFail: (response, type, reason) =>
      server_error = false
      console.log response.responseText
      try
        errors = JSON.parse(response.responseText)?.errors

        for error in errors
          if error.indexOf('Username') >= 0
            @usernameError(true)
          if error.indexOf('Password') >= 0
            @passwordError(true)
          if error.indexOf('Email') >= 0
            @emailError(true)

        @errors(errors)
      catch
        server_error = true
      @errors("An error occurred when creating account.  Please retry later.") if server_error

    _buildUserData: =>
      user =
        username: @username()
        first_name: @firstName()
        last_name: @lastName()
        password: @password()
        password_confirmation: @passwordConfirmation()
        email: @email()
        user_domain: @domain()
        organization_name: @organizationName()
        user_type: @userType()
        primary_study_area: @primaryStudyArea()
        # Country needs to be converted to addresses in controller
        country: @country()
        user_region: @region()
        # Should this be true?
        opt_in: false

      data =
        user: user


    _validateNewAccountForm: =>
      @_resetErrors()
      errors = []
      unless @username()?.length > 0
        errors.push "Please provide username"
        @usernameError(true)

      unless @password()?.length > 0
        errors.push "Please provide password"
        @passwordError(true)

      unless @password() == @passwordConfirmation()
        errors.push "Password must match confirmation"
        @passwordError(true)
        @passwordConfirmationError(true)

      unless @firstName()?.length > 0
        errors.push "Please provide first name"
        @firstNameError(true)

      unless @lastName()?.length > 0
        errors.push "Please provide last name"
        @lastNameError(true)

      unless @email()?.length > 0
        errors.push "Please provide email"
        @emailError(true)

      unless @domain()?.length > 0
        errors.push "Please select domain"
        @domainError(true)

      unless @organizationName()?.length > 0
        errors.push "Please provide organization name"
        @organizationNameError(true)

      unless @userType()?.length > 0
        errors.push "Please select type of user"
        @userTypeError(true)

      unless @primaryStudyArea()?.length > 0
        errors.push "Please select primary study area"
        @primaryStudyAreaError(true)

      unless @country()?.length > 0
        errors.push "Please select country"
        @countryError(true)

      @errors(errors.join(", "))

    clearAccountForm: =>
      @errors("")
      @_resetErrors()
      @_resetFields()

    _resetFields: =>
      @email("")
      @username("")
      @password("")
      @passwordConfirmation("")
      @firstName("")
      @lastName("")
      @organizationName("")
      @domain("")
      @userType("")
      @primaryStudyArea("")
      @country("")

    _resetErrors: =>
      @emailError(false)
      @usernameError(false)
      @passwordError(false)
      @passwordConfirmationError(false)
      @firstNameError(false)
      @lastNameError(false)
      @organizationNameError(false)
      @domainError(false)
      @userTypeError(false)
      @primaryStudyAreaError(false)
      @countryError(false)

  exports = User
