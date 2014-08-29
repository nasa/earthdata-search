#= require models/data/account
#= require models/ui/account_form

data = @edsc.models.data
ui = @edsc.models.ui
ns = @edsc.models.page

ns.CreateAccountPage = do (ko
                          setCurrent = ns.setCurrent
                          AccountModel = data.Account
                          AccountFormModel = ui.AccountForm
                          ) ->

  class AccountPage
    constructor: ->
      @account = new AccountModel()
      @bindingsLoaded = ko.observable(false)

      @ui =
        isLandingPage: false
        accountForm: new AccountFormModel(@account, false)

  setCurrent(new AccountPage())

  exports = AccountPage