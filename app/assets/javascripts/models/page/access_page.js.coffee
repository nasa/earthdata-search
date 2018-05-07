#= require models/data/query
#= require models/data/project
#= require models/data/account
#= require models/data/preferences
#= require models/ui/temporal
#= require models/ui/project_list
#= require models/ui/service_options_list
#= require models/ui/account_form
#= require models/ui/feedback
#= require models/ui/sitetour

data = @edsc.models.data
ui = @edsc.models.ui
ns = @edsc.models.page

ns.AccessPage = do (ko,
                    setCurrent = ns.setCurrent
                    urlUtil = @edsc.util.url
                    pageData = @edscPageData
                    QueryModel = data.query.CollectionQuery
                    ProjectModel = data.Project
                    AccountModel = data.Account
                    PreferencesModel = data.Preferences
                    AccountFormModel = ui.AccountForm
                    TemporalModel = ui.Temporal
                    ProjectListModel = ui.ProjectList
                    SiteTourModel = ui.SiteTour
                    ServiceOptionsListModel = ui.ServiceOptionsList
                    FeedbackModel = ui.Feedback
                    ) ->

  class AccessPage

    constructor: ->
      @query = new QueryModel()
      @project = new ProjectModel(@query, false)
      @bindingsLoaded = ko.observable(false)
      @account = new AccountModel()
      @preferences = new PreferencesModel()

      projectList = new ProjectListModel(@project)
      accountForm = new AccountFormModel(@account, true)

      @ui =
        temporal: new TemporalModel(@query)
        # TODO: Why is this needed on this page?  There is no project list here.
        projectList: projectList
        accountForm: accountForm
        serviceOptionsList: new ServiceOptionsListModel(accountForm, @project)
        feedback: new FeedbackModel()
        sitetour: new SiteTourModel()

      setTimeout((=>
        if pageData
          @project.id(pageData.id)
          @project.fromJson(pageData)
        else
          @_loadFromUrl()
          $(window).on 'edsc.pagechange', @_loadFromUrl), 0)

    _loadFromUrl: =>
      @project.serialized(urlUtil.currentParams())

  setCurrent(new AccessPage())

  exports = AccessPage
