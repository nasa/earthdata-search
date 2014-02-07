ns = @edsc.models.data

ns.User = do (ko, doPost=jQuery.post) ->

  class User
    constructor: ->
      @token = ko.observable(null)
      @name = ko.observable("")
      @username = ko.observable("")
      @password = ko.observable("")
      @errors = ko.observable("")
      @isLoggedIn = ko.computed =>
        @token()?
      @needsLogin = ko.observable(false)
      @loginCallback = null

    initiateLogin: =>
      @needsLogin(true)

    cancelLogin: =>
      @clearLogin()

    clearLogin: =>
      @username("")
      @password("")
      @needsLogin(false)

    login: () =>
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
        @errors("An error occurred when logging in.  Please retry later.")

    logout: =>
      @token(null)
      @username("")

  exports = User