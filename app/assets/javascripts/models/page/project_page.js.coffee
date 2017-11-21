#= require models/data/query
#= require models/data/project
#= require models/data/preferences
#= require models/data/spatial_entry
#= require models/ui/spatial_type
#= require models/ui/temporal
#= require models/ui/project_list
#= require models/ui/service_options_list
#= require models/ui/feedback
#= require models/ui/sitetour
#= require models/ui/granules_list


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
                     SpatialEntry = data.SpatialEntry
                     SpatialTypeModel = ui.SpatialType
                     PreferencesModel = data.Preferences
                     TemporalModel = ui.Temporal
                     ProjectListModel = ui.ProjectList
                     SiteTourModel = ui.SiteTour
                     ServiceOptionsListModel = ui.ServiceOptionsList
                     FeedbackModel = ui.Feedback
                     ajax=@edsc.util.xhr.ajax
                     GranulesList = ui.GranulesList
                   ) ->
  current = null

  $(document).ready ->
    current.map = map = new window.edsc.map.Map(document.getElementById('bounding-box-map'), 'geo', true)
    
  class ProjectPage
    constructor: ->
      @query = new QueryModel()
      @collections = new CollectionsModel(@query)
      @project = new ProjectModel(@query)
      @projectQuery = 
      @id = window.location.href.match(/\/projects\/(\d+)$/)?[1]
      @bindingsLoaded = ko.observable(false)
      @spatialEntry = new SpatialEntry(@query.spatial)
      
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

      @spatialError = ko.computed(@_computeSpatialError)
      

      $(window).on 'edsc.save_workspace', (e)=>
        urlUtil.saveState('/search/collections', urlUtil.currentParams(), true, @workspaceNameField())
        @workspaceName(@workspaceNameField())
        $('.save-dropdown').removeClass('open')

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
      if @query.serialize().temporal
        m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
        label = "" 
        console.error @query.serialize().temporal
        dates = @query.serialize().temporal.split(",")
        date1 = dates[0].split("T")[0].split("-")
        formattedDate = new Date(date1[0] + "-" + date1[1].replace(/^0+/, '') + "-" + date1[2].replace(/^0+/, ''))
        d1 = formattedDate.getDate()
        m1 = formattedDate.getMonth()
        y1 = formattedDate.getFullYear();
        date2 = dates[1].split("T")[0].split("-")
        formattedDate = new Date(date2[0] + "-" + date2[1].replace(/^0+/, '') + "-" + date2[2].replace(/^0+/, ''))
        d2 = formattedDate.getDate()
        m2 = formattedDate.getMonth()
        y2 = formattedDate.getFullYear();
        if y1==y2
          if m1==m2
            label = m_names[m1] + " " + d1 + " - " + d2 + ", " + y1
          else
            label = m_names[m1] + " " + d1 + " - " + m_names[m2] + " " + d2 + ", " + y1
        else
          label = if m1 then m_names[m1] + " " + d1 + ", " + y1 else "Beginning of time "
          label += if m2 then " - " + m_names[m2] + " " + d2 + ", " + y2 else " - End of Time"
        label
      else
        false

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
        for collection in @project.collections()
          granules = collection.cmrGranulesModel
          if granules.isLoaded()
            loadedCollectionNum += 1
            _size = 0
            _size += parseFloat(granule.granule_size ? 0) for granule in granules.results()
            totalSize = _size / granules.results().length * granules.hits()
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

  current = new ProjectPage()
  setCurrent(current)

  exports = ProjectPage
