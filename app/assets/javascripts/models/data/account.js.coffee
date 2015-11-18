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
      @street1(json?.street1)
      @street2(json?.street2)
      @street3(json?.street3)
      @city(json?.city)
      @state(json?.state)
      @zip(json?.zip)
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
      @firstName = ko.observable("")
      @middleInitial = ko.observable("")
      @lastName = ko.observable("")
      @organizationName = ko.observable("")
      @affiliation = ko.observable("")
      @studyArea = ko.observable("")
      @userType = ko.observable("")
      @domain = ko.observable("")
      @userType = ko.observable("")
      @primaryStudyArea = ko.observable("")
      @address = new Address()
      @region = ko.computed =>
        if @address.country() == "United States" then "USA" else "INTERNATIONAL"

      @phone = new Phone("BUSINESS")
      @phone.number = "0000000000"
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

    updateNotificationPreference: (callback) =>
      @message('')

      if @errors()?.length == 0
        xhr = ajax
          url: '/users/update_notification_pref'
          data: @_buildPreferences()
          dataType: 'json'
          method: 'post'
          success: (response) =>
            @_preferencesFromJson(response)
            @preferencesLoaded(true)
            @message("Successfully updated notification preference")
            callback?()
          fail: (response, type, reason) =>
            @preferencesLoaded(false)
            errors = JSON.parse(response.responseText)?.errors
            @errors(errors)

    _preferencesFromJson: (json) =>
      prefs = json.preferences
      @notificationLevel(prefs.order_notification_level)
      contact = prefs.general_contact
      if contact?
        @firstName(contact.first_name)
        @lastName(contact.last_name)
        @email(contact.email_address)
        @userType(contact.user_type)
        @affiliation(contact.affiliation)
        @studyArea(contact.study_area)
        @organizationName(contact.organization)
        @role(contact.role)
        @address.from_json(contact)
        for phone in contact.phones ? []
          if phone.phone_number_type == "BUSINESS"
            @phone.number(phone.number)
            @phone.id(phone.id)

    _buildPreferences: =>
      phones = []
      phones.push(@phone.to_json()) if @phone.number()?.length > 0

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

  exports = Account
