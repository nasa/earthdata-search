#= require models/data/query
#= require models/data/project
#= require models/data/user
#= require models/ui/temporal
#= require models/ui/project_list
#= require models/ui/service_options_list

data = @edsc.models.data
ui = @edsc.models.ui
ns = @edsc.models.page

ns.AccessPage = do (ko,
                    setCurrent = ns.setCurrent
                    accessData = @edscPageData
                    QueryModel = data.Query
                    ProjectModel = data.Project
                    UserModel = data.User
                    TemporalModel = ui.Temporal
                    ProjectListModel = ui.ProjectList
                    ServiceOptionsListModel = ui.ServiceOptionsList
                    ) ->

  class AccessPage
    constructor: ->
      @query = new QueryModel()
      @project = new ProjectModel(@query)
      @bindingsLoaded = ko.observable(false)
      @user = new UserModel()

      @ui =
        isLandingPage: false
        temporal: new TemporalModel(@query)
        projectList: new ProjectListModel(@project, @user)
        serviceOptionsList: new ServiceOptionsListModel()

      @project.fromJson(accessData)

  setCurrent(new AccessPage())

  exports = AccessPage
