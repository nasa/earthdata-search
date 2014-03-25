#= require models/data/user

ns = @edsc.models.data

ns.Account = do (ko
                doPost=jQuery.post
                UserModel=ns.User) ->

  class Account
    constructor: ->
      @username = ko.observable("")
      @usernameError = ko.observable(false)
      @password = ko.observable("")
      @passwordError = ko.observable(false)
      @email = ko.observable("")
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

      @errors = ko.observable("")

      @user = new UserModel()


    createAccount: =>
      @_validateNewAccountForm()
      if @errors()?.length == 0
        xhr = doPost '/users', @_buildUserData(), (response) =>
          @user.username(@username())
          @user.password(@password())
          @user.login()
          @clearAccountForm()
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

      if errors?.length > 1
        @errors("Please fill in all required fields, identified highlighted below")
      else
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

  exports = Account
