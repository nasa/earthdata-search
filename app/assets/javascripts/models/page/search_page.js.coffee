#= require models/data/query
#= require models/data/collections
#= require models/data/project
#= require models/data/preferences
#= require models/data/spatial_entry
#= require models/ui/spatial_type
#= require models/ui/temporal
#= require models/ui/collections_list
#= require models/ui/project_list
#= require models/ui/granule_timeline
#= require models/ui/state_manager
#= require models/ui/feedback

models = @edsc.models
data = models.data
ui = models.ui

ns = models.page

ns.SearchPage = do (ko
                    setCurrent = ns.setCurrent
                    QueryModel = data.query.CollectionQuery
                    CollectionsModel = data.Collections
                    ProjectModel = data.Project
                    SpatialEntry = data.SpatialEntry
                    SpatialTypeModel = ui.SpatialType
                    CollectionsListModel = ui.CollectionsList
                    ProjectListModel = ui.ProjectList
                    GranuleTimelineModel = ui.GranuleTimeline
                    PreferencesModel = data.Preferences
                    FeedbackModel = ui.Feedback
                    StateManager = ui.StateManager) ->
  current = null

  $(document).ready ->
    current.map = map = new window.edsc.map.Map(document.getElementById('map'), 'geo')
    current.ui.granuleTimeline = new GranuleTimelineModel(current.ui.collectionsList, current.ui.projectList)
    $('.master-overlay').masterOverlay()

  class SearchPage
    constructor: ->
      @query = new QueryModel()
      @collections = new CollectionsModel(@query)
      @project = new ProjectModel(@query)
      @preferences = new PreferencesModel()
      @spatialEntry = new SpatialEntry(@query.spatial)

      @ui =
        spatialType: new SpatialTypeModel(@query)
        collectionsList: new CollectionsListModel(@query, @collections, @project)
        projectList: new ProjectListModel(@project, @collections)
        isLandingPage: ko.observable(null) # Used by modules/landing
        feedback: new FeedbackModel()

      @bindingsLoaded = ko.observable(false)
      @labs = ko.observable(false)

      @spatialError = ko.computed(@_computeSpatialError)

      @collections.isRelevant(false) # Avoid load until the URL says it's ok

      @workspaceName = ko.observable(null)
      @workspaceNameField = ko.observable(null)

      @project.focus.subscribe(@_updateFocusRenderState)

      new StateManager(this).monitor()

    _updateFocusRenderState: (newFocus) =>
      if @_focus
        @_focus.notifyRenderers('endSearchFocus')
      @_focus = newFocus
      if @_focus
        @_focus.notifyRenderers('startSearchFocus')

    clearFilters: =>
      @query.clearFilters()
      @ui.spatialType.selectNone()
      @ui.spatialType.clearManualEntry()
      @spatialEntry.clearError()

    pluralize: (value, singular, plural) ->
      word = if value == 1 then singular else plural
      "#{value} #{word}"

    _computeSpatialError: =>
      error = @collections.error()
      if error?
        for e in error
          return e if e? && (e.indexOf('polygon') != -1 ||
                              e.indexOf('box') != -1 ||
                              e.indexOf('point') != -1)
      null

    hideParent: =>
      $('.master-overlay').masterOverlay('manualHideParent')

    showParent: =>
      $('.master-overlay').masterOverlay('manualShowParent')

  current = new SearchPage()
  setCurrent(current)

  exports = SearchPage
