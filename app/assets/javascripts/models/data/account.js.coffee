#= require models/data/user

ns = @edsc.models.data

ns.Account = do (ko
                doPost=jQuery.post
                getJSON=jQuery.getJSON
                UserModel=ns.User) ->

  class Address
    constructor: ->
      @street1 = ko.observable("")
      @street2 = ko.observable("")
      @street3 = ko.observable("")
      @city = ko.observable("")
      @state = ko.observable("")
      @zip = ko.observable("")
      @country = ko.observable("")

    to_json: =>
      address =
        street1: @street1()
        street2: @street2()
        street3: @street3()
        city: @city()
        state: @state()
        zip: @zip()
        country: @country()

    from_json: (json) =>
      @street1(json.street1)
      @street2(json.street2)
      @street3(json.street3)
      @city(json.city)
      @state(json.state)
      @zip(json.zip)
      @country(json.country)

    clear: =>
      @street1("")
      @street2("")
      @street3("")
      @city("")
      @state("")
      @zip("")
      @country("")

  class Phone
    constructor: (type) ->
      @id = ko.observable("")
      @number = ko.observable("")
      @type = type

    to_json: =>
      phone =
        id: @id()
        number: @number()
        phone_number_type: @type

  class Account
    constructor: (@user) ->
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
      @address = new Address()
      @countryError = ko.observable(false)
      @region = ko.computed =>
        if @address.country() == "United States" then "USA" else "INTERNATIONAL"

      @phone = new Phone("BUSINESS")
      @fax = new Phone("BUSINESS_FAX")
      @notificationLevel = ko.observable("")

      @errors = ko.observable("")

      if @user.name()?.length > 0
        @_from_user()
      else
        @user = new UserModel()

    _from_user: =>
      # call echo to get user information
      xhr = getJSON "/users/get_contact_info", (data, status, xhr) =>
        user = data.user
        userId = data.user.id
        @username(user.username)
        @firstName(user.first_name)
        @lastName(user.last_name)
        @email(user.email)
        @domain(user.user_domain)
        @userType(user.user_type)
        @primaryStudyArea(user.primary_study_area)
        @organizationName(user.organization_name)
        @address.from_json(user.addresses[0])
        @get_phones(userId)
        @get_preferences(userId)

    get_phones: (userId) =>
      params =
        user_id: userId

      xhr = getJSON "/users/get_phones", params, (data) =>
        for obj in data
          if obj.phone.phone_number_type == "BUSINESS"
            @phone.number(obj.phone.number)
            @phone.id(obj.phone.id)
          else if obj.phone.phone_number_type == "BUSINESS_FAX"
            @fax.number(obj.phone.number)
            @fax.id(obj.phone.id)

    get_preferences: (userId) =>
      params =
        user_id: userId

      xhr = getJSON "/users/get_preferences", params, (data) =>
        @notificationLevel(data.preferences.order_notification_level)

    updateContactInformation: =>
      xhr = doPost '/users/update_contact_info', @_buildUserData(), (response) =>
        # set success message

        #set failure message

    createAccount: =>
      # Fix chrome autocomplete issues
      @username(document.getElementById('username')?.value) unless @username()?.length > 0
      @password(document.getElementById('password')?.value) unless @password()?.length > 0
      @email(document.getElementById('email')?.value) unless @email()?.length > 0
      @firstName(document.getElementById('first_name')?.value) unless @firstName()?.length > 0
      @lastName(document.getElementById('last_name')?.value) unless @lastName()?.length > 0
      @organizationName(document.getElementById('organization_name')?.value) unless @organizationName()?.length > 0
      @domain(document.getElementById('user_domain')?.value) unless @domain()?.length > 0
      @userType(document.getElementById('user_type')?.value) unless @userType()?.length > 0
      @primaryStudyArea(document.getElementById('primary_study_area')?.value) unless @primaryStudyArea()?.length > 0
      @address.country(document.getElementById('country')?.value) unless @address.country()?.length > 0

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
        password: @password() if @password()?.length > 0
        password_confirmation: @passwordConfirmation() if @passwordConfirmation()?.length > 0
        email: @email()
        user_domain: @domain()
        organization_name: @organizationName()
        user_type: @userType()
        primary_study_area: @primaryStudyArea()
        user_region: @region()
        # Should this be true?
        opt_in: false

        addresses: @address.to_json()
        phone: @phone.to_json() if @phone.number()?.length > 0
        fax: @fax.to_json() if @fax.number()?.length > 0
        preferences: @notificationLevel() if @notificationLevel()?.length > 0

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

      unless @address.country()?.length > 0
        errors.push "Please select country"
        @countryError(true)

      if errors?.length > 1
        errors = ["Please fill in all required fields, highlighted below"]

      unless @password() == @passwordConfirmation()
        errors.push "Password must match confirmation"
        @passwordError(true)
        @passwordConfirmationError(true)

      @errors(errors)

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
      @address.clear()

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
