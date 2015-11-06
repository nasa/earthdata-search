ns = @edsc.models.data

ns.Account = do (ko, ajax=@edsc.util.xhr.ajax) ->

  class Account
    constructor: ->
      @email = ko.observable("")
      @firstName = ko.observable("")
      @middleInitial = ko.observable("")
      @lastName = ko.observable("")
      @organizationName = ko.observable("")
      @affiliation = ko.observable("")
      @country = ko.observable("")
      @userType = ko.observable("")
      @studyArea = ko.observable("")

      @notificationLevel = ko.observable("")

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
          url: '/users/update_contact_info'
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
        @middleInitial(contact.middle_initial)
        @lastName(contact.last_name)
        @email(contact.email_address)
        @organizationName(contact.organization)

        @country(contact.country)

        @userType(contact.user_type)
        @studyArea(contact.study_area)
        @affiliation(contact.affiliation)

    _buildPreferences: =>
      contact =
        first_name: @firstName()
        last_name: @lastName()
        email: @email()
        organization: @organizationName()

      prefs =
        general_contact: contact
        order_notification_level: @notificationLevel()

      data =
        preferences: prefs

  exports = Account
