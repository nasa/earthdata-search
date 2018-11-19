ns = @edsc.models.data

ns.Account = do (ko, ajax=@edsc.util.xhr.ajax) ->

  class Account
    constructor: ->
      @email = ko.observable("Loading ...")
      @firstName = ko.observable("Loading ...")
      @middleInitial = ko.observable("Loading ...")
      @lastName = ko.observable("Loading ...")
      @organizationName = ko.observable("Loading ...")
      @affiliation = ko.observable("Loading ...")
      @studyArea = ko.observable("Loading ...")
      @userType = ko.observable("Loading ...")
      @userType = ko.observable("Loading ...")
      @primaryStudyArea = ko.observable("Loading ...")
      @notificationLevel = ko.observable("")
      @country = ko.observable("Loading ...")
      @errors = ko.observable("")
      @message = ko.observable("")
      @preferencesLoaded = ko.observable(false)

      # if window.tokenExpiresIn?
      #   @_from_user()

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
            @_from_user()
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
        @country(contact.country)

    _buildPreferences: =>
      contact =
        first_name: @firstName()
        last_name: @lastName()
        email: @email()
        organization: @organizationName()
        address:
          country: @country()
        phones: [{number:"0000000000",phone_number_type:"BUSINESS"}]

      prefs =
        general_contact: contact
        order_notification_level: @notificationLevel()

      data =
        preferences: prefs

  exports = Account
