#= require models/data/query
#= require models/data/datasets
#= require models/data/dataset_facets
#= require models/data/project
#= require models/data/user
#= require models/data/preferences
#= require models/ui/spatial_type
#= require models/ui/temporal
#= require models/ui/datasets_list
#= require models/ui/project_list
#= require models/ui/granule_timeline

models = @edsc.models
data = models.data
ui = models.ui

ns = models.page

ns.SearchPage = do (ko,
                    config = @edsc.config
                    setCurrent = ns.setCurrent,
                    QueryModel = data.Query,
                    DatasetsModel = data.Datasets
                    DatasetFacetsModel = data.DatasetFacets
                    ProjectModel = data.Project
                    UserModel = data.User
                    SpatialTypeModel = ui.SpatialType
                    TemporalModel = ui.Temporal
                    DatasetsListModel = ui.DatasetsList
                    ProjectListModel = ui.ProjectList
                    GranuleTimelineModel = ui.GranuleTimeline
                    PreferencesModel = data.Preferences) ->

  class SearchPage
    constructor: ->
      @query = new QueryModel(config.baseQueryParams)
      @user = new UserModel()
      @datasets = new DatasetsModel(@query)
      @datasetFacets = new DatasetFacetsModel(@query)
      @project = new ProjectModel(@query)
      @preferences = new PreferencesModel(@user)

      @ui =
        spatialType: new SpatialTypeModel()
        temporal: new TemporalModel(@query)
        datasetsList: new DatasetsListModel(@query, @datasets)
        projectList: new ProjectListModel(@project, @user, @datasets)
        isLandingPage: ko.observable(null) # Used by modules/landing
        granuleTemporal: null

      @bindingsLoaded = ko.observable(false)

      @spatialError = ko.computed(@_computeSpatialError)

    pluralize: (value, singular, plural) ->
      word = if value == 1 then singular else plural
      "#{value} #{word}"

    _computeSpatialError: =>
      error = @datasets.error()
      if error?
        return "Polygon boundaries must not cross themselves" if error.indexOf('ORA-13349') != -1
        return "Polygon is too large" if error.indexOf('ORA-13367') != -1
        return error if error.indexOf('ORA-') != -1
      null

  current = new SearchPage()
  setCurrent(current)

  $(document).ready ->
    $('#timeline').timeline()
    current.ui.granuleTimeline = new GranuleTimelineModel(current.ui.datasetsList, current.ui.projectList)

  exports = SearchPage
