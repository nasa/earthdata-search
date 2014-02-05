do ($=jQuery, userModel=@edsc.models.page.current.user) ->

  hideLoginModal = ->
    $("#login-modal").modal("hide")

  clearLoginFields = ->
    $("#login-modal input").val("")

  $(document).ready ->
    userModel.isLoggedIn.subscribe (isLoggedIn) ->
      if isLoggedIn
        hideLoginModal()

    $("#login-modal").on 'hide.bs.modal', ->
      clearLoginFields()
