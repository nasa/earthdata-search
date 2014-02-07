ns = @edsc.models.data

ns.User = do (ko, doPost=jQuery.post) ->

  class User
    constructor: ->
      @token = ko.observable("")
      @username = ko.observable("")
      @errors = ko.observable("")
      @isLoggedIn = ko.observable(false)

      @_loadStateFromCookie()

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
        @_setCookie("token", @token())
        @_setCookie("username", @username())

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
        @errors("An error occurred when logging in.  Please retry later.") if server_error

    logout: =>
      @isLoggedIn(false)
      @token("")
      @username("")
      @_setCookie("token", "")
      @_setCookie("username", "")

    # https://gist.github.com/dmix/2222990
    _setCookie: (name, value) ->
      document.cookie = name + "=" + escape(value)

    _readCookie: (name) ->
      nameEQ = name + "="
      ca = document.cookie.split(";")
      i = 0
      while i < ca.length
        c = ca[i]
        c = c.substring(1, c.length)  while c.charAt(0) is " "
        return c.substring(nameEQ.length, c.length).replace(/"/g, '')  if c.indexOf(nameEQ) is 0
        i++
      null

    _loadStateFromCookie: =>
      @token(@_readCookie("token"))
      @username(@_readCookie("username"))
      @isLoggedIn(@token() and @username())

  exports = User