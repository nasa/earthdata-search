ns = @edsc.models.data

ns.Account = do (ko, ajax=@edsc.util.xhr.ajax) ->

  class Address
    constructor: ->
      @street1 = ko.observable("")
      @street2 = ko.observable("")
      @street3 = ko.observable("")
      @city = ko.observable("")
      @state = ko.observable("")
      @zip = ko.observable("")
      @country = ko.observable("")
      @countryError = ko.observable(false)

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
    constructor: ->
      @email = ko.observable("")
      @emailError = ko.observable(false)
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
      @region = ko.computed =>
        if @address.country() == "United States" then "USA" else "INTERNATIONAL"

      @phone = new Phone("BUSINESS")
      @fax = new Phone("BUSINESS_FAX")
      @notificationLevel = ko.observable("")
      @role = ko.observable("Main User Contact")

      @errors = ko.observable("")
      @message = ko.observable("")
      @preferencesLoaded = ko.observable(false)

      if window.tokenExpiresIn?
        @_from_user()

    _from_user: =>
      xhr = ajax
        url: "/users/get_preferences"
        dataType: 'json'
        method: 'get'
        success: (data) =>
          @_preferencesFromJson(data)
          @preferencesLoaded(true)
        fail: (response, type, reason) =>
          @preferencesLoaded(false)
          if response.status == 404
            @errors([])
          else
            @errors(["Contact information could not be loaded, please try again later"])

    updateContactInformation: (callback) =>
      @message('')
      @_validateContactInfoForm()

      if @errors()?.length == 0
        xhr = ajax
          url: '/users/update_contact_info'
          data: @_buildPreferences()
          dataType: 'json'
          method: 'post'
          success: (response) =>
            @_preferencesFromJson(response)
            @preferencesLoaded(true)
            @message("Successfully updated contact information")
            callback?()
          fail: (response, type, reason) =>
            @preferencesLoaded(false)
            server_error = false
            try
              errors = JSON.parse(response.responseText)?.errors

              for error in errors
                if error.indexOf('Email') >= 0
                  @emailError(true)
                # TODO: list other account fields here

              @errors(errors)
            catch
              server_error = true
            @errors(["Contact information could not be updated, please try again later"]) if server_error

    _preferencesFromJson: (json) =>
      prefs = json.preferences
      @notificationLevel(prefs.order_notification_level)
      contact = prefs.general_contact
      if contact?
        @firstName(contact.first_name)
        @lastName(contact.last_name)
        @email(contact.email)
        @organizationName(contact.organization)
        @role(contact.role)
        @address.from_json(contact.address)
        for phone in contact.phones ? []
          if phone.phone_number_type == "BUSINESS"
            @phone.number(phone.number)
            @phone.id(phone.id)
          else if phone.phone_number_type == "BUSINESS_FAX"
            @fax.number(phone.number)
            @fax.id(phone.id)

    _buildPreferences: =>
      phones = []
      phones.push(@phone.to_json()) if @phone.number()?.length > 0
      phones.push(@fax.to_json()) if @fax.number()?.length > 0

      contact =
        first_name: @firstName()
        last_name: @lastName()
        email: @email()
        organization: @organizationName()
        address: @address.to_json()
        phones: phones
        role: @role()

      prefs =
        general_contact: contact
        order_notification_level: @notificationLevel()

      data =
        preferences: prefs

    _buildUserData: =>
      user =
        first_name: @firstName()
        last_name: @lastName()
        email: @email()
        user_domain: @domain()
        organization_name: @organizationName()
        user_type: @userType()
        primary_study_area: @primaryStudyArea()
        user_region: @region()
        # Should this be true?
        opt_in: false

        address: {country: @address.country()}

      data =
        user: user

    _validateContactInfoForm: =>
      @_resetErrors()
      errors = []

      unless @firstName()?.length > 0
        errors.push "Please provide first name"
        @firstNameError(true)

      unless @lastName()?.length > 0
        errors.push "Please provide last name"
        @lastNameError(true)

      unless @email()?.length > 0
        errors.push "Please provide email"
        @emailError(true)

      if errors?.length > 1
        errors = ["Please fill in all required fields, highlighted below"]

      @errors(errors)

    clearAccountForm: =>
      @errors("")
      @_resetErrors()
      @_resetFields()

    _resetFields: =>
      @email("")
      @firstName("")
      @lastName("")
      @organizationName("")
      @domain("")
      @userType("")
      @primaryStudyArea("")
      @address.clear()

    _resetErrors: =>
      @emailError(false)
      @firstNameError(false)
      @lastNameError(false)
      @organizationNameError(false)
      @domainError(false)
      @userTypeError(false)
      @primaryStudyAreaError(false)
      @address.countryError(false)

  exports = Account
