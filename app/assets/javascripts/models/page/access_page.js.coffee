#= require models/data/query
#= require models/data/project
#= require models/data/user
#= require models/data/account
#= require models/ui/temporal
#= require models/ui/project_list
#= require models/ui/service_options_list
#= require models/ui/account_form

data = @edsc.models.data
ui = @edsc.models.ui
ns = @edsc.models.page

ns.AccessPage = do (ko,
                    setCurrent = ns.setCurrent
                    deparam = @edsc.util.deparam
                    pageData = @edscPageData
                    QueryModel = data.query.DatasetQuery
                    ProjectModel = data.Project
                    UserModel = data.User
                    AccountModel = data.Account
                    AccountFormModel = ui.AccountForm
                    TemporalModel = ui.Temporal
                    ProjectListModel = ui.ProjectList
                    ServiceOptionsListModel = ui.ServiceOptionsList
                    ) ->

  class AccessPage
    constructor: ->
      @query = new QueryModel()
      @project = new ProjectModel(@query, false)
      @bindingsLoaded = ko.observable(false)
      @user = new UserModel()
      @account = new AccountModel(@user)

      projectList = new ProjectListModel(@project, @user)
      accountForm = new AccountFormModel(@account, true)

      @ui =
        isLandingPage: false
        temporal: new TemporalModel(@query)
        # TODO: Why is this needed on this page?  There is no project list here.
        projectList: projectList
        accountForm: accountForm
        serviceOptionsList: new ServiceOptionsListModel(accountForm, @project)

      if pageData
        @project.fromJson(pageData)
      else
        @project.serialized(deparam(window.location.search[1...]))


  setCurrent(new AccessPage())

  exports = AccessPage
