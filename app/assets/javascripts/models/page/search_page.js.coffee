#= require models/data/query
#= require models/data/datasets
#= require models/data/dataset_facets
#= require models/data/project
#= require models/data/user
#= require models/ui/spatial_type
#= require models/ui/temporal
#= require models/ui/datasets_list
#= require models/ui/project_list

models = @edsc.models
data = models.data
ui = models.ui

ns = models.page

ns.SearchPage = do (ko,
                    setCurrent = ns.setCurrent,
                    QueryModel = data.Query,
                    DatasetsModel = data.Datasets
                    DatasetFacetsModel = data.DatasetFacets
                    ProjectModel = data.Project
                    UserModel = data.User
                    SpatialTypeModel = ui.SpatialType
                    TemporalModel = ui.Temporal
                    DatasetsListModel = ui.DatasetsList
                    ProjectListModel = ui.ProjectList) ->

  class SearchPage
    constructor: ->
      @query = new QueryModel()

      # For testing granule visualizations
      #VISUALIZED_IDS = [
      #  'C204200620-GSFCS4PA', # Bounding-box granules
      #  'C1000000080-CDDIS', # Point-based granules, distributed geographically
      #  'C14758250-LPDAAC_ECS', # AST_L1A
      #  'C1000000016-LANCEMODIS', # GIBS
      #  'C1000000019-LANCEMODIS', # GIBS
      #  'C90757596-LAADS'] # Opaque GIBS (fake, for testing)
      #@query = new QueryModel(echo_collection_id: VISUALIZED_IDS)

      @user = new UserModel()
      @datasets = new DatasetsModel(@query)
      @datasetFacets = new DatasetFacetsModel(@query)
      @project = new ProjectModel(@query)

      @ui =
        spatialType: new SpatialTypeModel()
        temporal: new TemporalModel(@query)
        datasetsList: new DatasetsListModel(@query, @datasets)
        projectList: new ProjectListModel(@project, @user, @datasets)
        isLandingPage: ko.observable(null) # Used by modules/landing

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

  setCurrent(new SearchPage())

  exports = SearchPage