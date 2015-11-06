ns = @edsc.models.ui

ns.AccountForm = do (ko, $=jQuery) ->
  class AccountForm
    constructor: (@account, @isServiceForm) ->
      @_userRequestedEdit = ko.observable(false)
      @isEditingNotificationPreference = ko.computed(@_computeIsEditingNotificationPreference, this)

    needsAccount: =>
      true

    hasCompleteAccount: =>
      account = @account
      {address, phone} = account
      complete = account.firstName() && account.lastName() && account.email()
      if @isServiceForm
        complete &&= address.street1() && address.city() && address.country() && phone.number()
        if address.country() == 'United States'
          complete &&= address.zip() && address.state()
      complete

    editAccount: =>
      @_userRequestedEdit(true)

    validate: =>
      for input in $('.account-form .required :input')
        $input = $(input)
        $input.toggleClass('field-error', $.trim($input.val() ? "").length == 0)

      isValid = $('.account-form .field-error').length == 0

      if isValid
        @account.errors([])
      else
        @account.errors(['Please fill in all required fields, highlighted below'])
      isValid


    saveAccountEdit: (callback) =>
      if @validate()
        @account.updateContactInformation(callback)

    _computeIsEditingNotificationPreference: ->
      console.log ("----------" + !@isServiceForm)
      console.log "-----------" + @_userRequestedEdit()
      console.log "------ " + !@account.preferencesLoaded()
      console.log "+++00 " + !@hasCompleteAccount()
      !@isServiceForm || @_userRequestedEdit() || !@account.preferencesLoaded()

  exports = AccountForm
