#= require models/data/account
#= require models/ui/account_form
#= require models/ui/feedback
#= require models/ui/sitetour

data = @edsc.models.data
ui = @edsc.models.ui
ns = @edsc.models.page

ns.CreateAccountPage = do (ko
                          Page = ns.Page
                          setCurrent = ns.setCurrent
                          AccountModel = data.Account
                          AccountFormModel = ui.AccountForm
                          FeedbackModel = ui.Feedback
                          SiteTourModel = ui.SiteTour
                          ) ->

  class AccountPage extends Page
    constructor: ->
      super
      @account = new AccountModel()
      @bindingsLoaded = ko.observable(false)

      @ui =
        accountForm: new AccountFormModel(@account, false)
        feedback: new FeedbackModel()
        sitetour: new SiteTourModel()

  current = new AccountPage 'account'
  setCurrent(current)

  exports = AccountPage
