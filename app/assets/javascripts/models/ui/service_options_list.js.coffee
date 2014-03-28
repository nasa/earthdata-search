ns = @edsc.models.ui

ns.ServiceOptionsList = do (ko) ->
  class ServiceOptionsList
    constructor: (@account) ->
      @activeIndex = ko.observable(0)

      @_userRequestedEdit = ko.observable(false)
      @isEditingAccount = ko.computed(@_computeIsEditingAccount, this)

    showNext: =>
      @activeIndex(@activeIndex() + 1)

    showPrevious: =>
      @activeIndex(@activeIndex() - 1)

    needsAccount: =>
      true

    hasCompleteAccount: =>
      # TODO: Once we have the ability to create/edit, this should probably be
      #       replaced by @account.errors().length > 0 or similar
      account = @account
      {address, phone} = account
      (account.firstName() && account.lastName() && account.email() &&
       address.street1() && address.city() && address.country() &&
       phone.number())

    editAccount: =>
      @_userRequestedEdit(true)

    cancelAccountEdit: =>
      # TODO: Revert
      @_userRequestedEdit(false)

    saveAccountEdit: =>
      # TODO: Save
      @_userRequestedEdit(false)

    _computeIsEditingAccount: ->
      @_userRequestedEdit() || !@hasCompleteAccount()

  exports = ServiceOptionsList
