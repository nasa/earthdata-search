#= require models/data/query
#= require models/data/project
#= require models/data/preferences
#= require models/ui/spatial_type
#= require models/ui/temporal
#= require models/ui/project_list
#= require models/ui/service_options_list
#= require models/ui/feedback
#= require models/ui/sitetour
#= require models/ui/granules_list
#= require models/ui/variable_list

models = @edsc.models
data = models.data
ui = models.ui
ns = models.page

ns.ProjectPage = do (ko,
                     setCurrent = ns.setCurrent
                     urlUtil = @edsc.util.url
                     QueryModel = data.query.CollectionQuery
                     CollectionsModel = data.Collections
                     ProjectModel = data.Project
                     SpatialTypeModel = ui.SpatialType
                     PreferencesModel = data.Preferences
                     TemporalModel = ui.Temporal
                     ProjectListModel = ui.ProjectList
                     SiteTourModel = ui.SiteTour
                     ServiceOptionsListModel = ui.ServiceOptionsList
                     FeedbackModel = ui.Feedback
                     ajax=@edsc.util.xhr.ajax
                     GranulesList = ui.GranulesList
                     VariableSelector = ui.VariableSelector
                   ) ->
  current = null

  $(document).ready ->
    current.map = map = new window.edsc.map.Map(document.getElementById('bounding-box-map'), 'geo', true)
    
  class ProjectPage
    constructor: ->
      @query = new QueryModel()
      @collections = new CollectionsModel(@query)
      @project = new ProjectModel(@query)
      @id = window.location.href.match(/\/projects\/(\d+)$/)?[1]
      @bindingsLoaded = ko.observable(false)

      @preferences = new PreferencesModel()
      @workspaceName = ko.observable(null)
      @workspaceNameField = ko.observable(null)
      @projectSummary = ko.computed(@_computeProjectSummary, this, deferEvaluation: true)
      @isLoaded = ko.observable(false)
      @sizeProvided = ko.observable(true)

      projectList = new ProjectListModel(@project)
      @ui =
        spatialType: new SpatialTypeModel(@query)
        temporal: new TemporalModel(@query)
        projectList: projectList
        feedback: new FeedbackModel()
        sitetour: new SiteTourModel()
        variableSelector: new VariableSelector(@project)

      @spatialError = ko.computed(@_computeSpatialError)
      
      $(window).on 'edsc.save_workspace', (e) =>
        currentParams = @project.serialized()
        urlUtil.saveState('/search/collections', currentParams, true)

      setTimeout((=>
        @_loadFromUrl()
        $(window).on 'edsc.pagechange', @_loadFromUrl), 0)
   
    showType: =>
      if @query.serialize().bounding_box
        return "Rectangle"
      else if @query.serialize().polygon
        return "Polygon"
      else if @query.serialize().point
        return "Point"
      else
        return ""

    hasType: =>
      @query.serialize().bounding_box || @query.serialize().polygon || @query.serialize().point

    showTemporal: =>
      label = ""
      if @query.serialize().temporal
        dates = @query.serialize().temporal.split(",")
        
        dateStart = moment.utc(dates[0]) 
        dateEnd = moment.utc(dates[1])

        if dateStart.year() == dateEnd.year()
          if dateStart.month() == dateEnd.month()
            # format only showing the month and the year a single time (e.g., Jan 1 - 10, 2011)
            label = dateStart.format("MMM DD") + " - " + dateEnd.format("DD, YYYY")
          else
            # format only showing the year a single time (e.g., Jan 1 - Feb 10, 2011)
            label = dateStart.format("MMM DD") + " - " + dateEnd.format("MMM DD, YYYY")
        else
          # Otherwise, show the full date range (e.g., Jan 1, 2010 - Feb 10, 2011)
          label = if dateStart.isValid() then dateStart.format("MMM DD, YYYY") else "Any start time "
          label += if dateEnd.isValid() then " - " + dateEnd.format("MMM DD, YYYY") else " - Any end time"
        label
      else
        label
        
    _computeSpatialError: =>
      error = @collections.error()
      if error?
        for e in error
          return e if e? && (e.indexOf('polygon') != -1 ||
                              e.indexOf('box') != -1 ||
                              e.indexOf('point') != -1)
      null

    _loadFromUrl: (e)=>
      @project.serialized(urlUtil.currentParams())
      @workspaceName(urlUtil.getProjectName())

    _computeProjectSize: ->
      if @project.collections?().length > 0
        totalSizeInMB = 0.0
        for collection in @project.collections()
          totalSizeInMB += collection['total_size']
        @_convertSize(totalSizeInMB)

    _computeProjectSummary: ->
      if @project.collections?().length > 0
        projectGranules = 0
        projectSize = 0.0
        loadedCollectionNum = 0
        for projectCollection in @project.collections()
          collection = projectCollection.collection
          if collection.granuleDatasource()
            granules = collection.granuleDatasource().data()
            if granules.isLoaded()
              loadedCollectionNum += 1
              _size = 0
              _size += parseFloat(granule.granule_size ? 0) for granule in granules.results()
              totalSize = _size / granules.results().length * granules.hits()
              totalSize = 0 if isNaN(totalSize)
              projectGranules += granules.hits()
              collection.granule_hits(granules.hits())
              projectSize += totalSize
              if isNaN(totalSize) || (totalSize == 0 && granules.hits() > 0)
                collection.total_size('Not Provided')
                collection.unit('')
                @sizeProvided(false)
              else
                collection.total_size(@_convertSize(totalSize)['size'])
                collection.unit(@_convertSize(totalSize)['unit'])
                @sizeProvided(true)

        @isLoaded(true) if loadedCollectionNum == @project.collections?().length

        {projectGranules: projectGranules, projectSize: @_convertSize(projectSize)}

    _convertSize: (_size) ->
      _units = ['MB', 'GB', 'TB', 'PB', 'EB']
      while _size > 1024 && _units.length > 1
        _size = parseFloat(_size) / 1024
        _units.shift()
      {size: _size.toFixed(1), unit: _units[0]}

    spatial_enabled: ->
      serializedObj = @project.serialized()

      hasBoundingBox = serializedObj.bounding_box?.length > 0
      hasPolygon     = serializedObj.polygon?.length > 0

      # Return true if any of the spatial subsettings exist
      hasBoundingBox || hasPolygon

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        collectionId = $(elem).closest('.modal').prop('id').split('-modal')[0]
        collection = @project.collections().filter((collection) -> collection.id == collectionId).pop()
        collection.granuleDatasource().data().loadNextPage()

    downloadProject: =>
      $project = $('#data-access-project')
      $project.val(JSON.stringify(@project.serialize()))
      $('#data-access').submit()

  current = new ProjectPage()
  setCurrent(current)

  exports = ProjectPage
