#= require models/data/account
#= require models/ui/account_form

data = @edsc.models.data
ui = @edsc.models.ui
ns = @edsc.models.page

ns.CreateAccountPage = do (ko
                          setCurrent = ns.setCurrent
                          AccountModel = data.Account
                          AccountFormModel = ui.AccountForm
                          UserModel = data.User
                          ) ->

  class AccountPage
    constructor: ->
      @user = new UserModel()
      @account = new AccountModel(@user)
      @bindingsLoaded = ko.observable(false)

      @ui =
        isLandingPage: false
        accountForm: new AccountFormModel(@account, false)

  setCurrent(new AccountPage())

  exports = AccountPage