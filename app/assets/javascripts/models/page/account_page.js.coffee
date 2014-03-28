#= require models/data/account

data = @edsc.models.data
ns = @edsc.models.page

ns.CreateAccountPage = do (ko
                          setCurrent = ns.setCurrent
                          AccountModel = data.Account
                          UserModel = data.User
                          ) ->

  class AccountPage
    constructor: ->
      @user = new UserModel()
      @account = new AccountModel(@user)
      @bindingsLoaded = ko.observable(false)

      @ui =
        isLandingPage: false

  setCurrent(new AccountPage())

  exports = AccountPage