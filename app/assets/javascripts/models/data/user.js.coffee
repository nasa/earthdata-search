ns = @edsc.models.data

ns.User = do (ko, doPost=jQuery.post) ->

  class User
    constructor: ->
      @token = ko.observable("")
      @username = ko.observable("")
      @errors = ko.observable("")
      @isLoggedIn = ko.observable(false)

    login: (form) =>
      data =
        token:
          username: form.username.value
          password: form.password.value
          client_id: 'EDSC'

      @errors("")

      xhr = doPost "/login", data, (response) =>
        @isLoggedIn(true)
        token = response.token
        @token(token.id)
        @username(token.username)

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
      @isLoggedIn(false)
      @token("")
      @username("")

  exports = User