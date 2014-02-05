ns = @edsc.models.data

ns.User = do (ko, doPost=jQuery.post) ->

  class User
    constructor: ->
      @token = ko.observable("")
      @username = ko.observable("")
      @errors = ko.observable("")
      @isLoggedIn = ko.observable(false)

    login: (form) =>
      data = {
        "username" : form.username.value
        "password" : form.password.value
      }
      @errors("")

      xhr = doPost "/login", data, (response) =>
        @isLoggedIn(true)
        @token(response.id)
        @username(response.username)

      xhr.fail (response, type, reason) =>
        @errors(response.responseJSON)

    logout: =>
      @isLoggedIn(false)
      @token("")
      @username("")

  exports = User