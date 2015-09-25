//= require typeahead-0.10.2/typeahead.bundle

do (ko
    $=jQuery
    currentPage = window.edsc.models.page.current
    ajax=@edsc.util.xhr.ajax
    DatasetsListModel = window.edsc.models.ui.DatasetsList
    DatasetsModel = window.edsc.models.data.Datasets
    ProjectList = window.edsc.models.ui.ProjectList
    Project = window.edsc.models.data.Project
    StateManager = window.edsc.models.ui.StateManager) ->

  $(document).ready ->
    $placenameInputs = $('.autocomplete-placenames')

    datasetsList = new DatasetsListModel(currentPage.query, currentPage.ui.datasetsList, currentPage.ui.projectList.project)
    datasetsModel = new DatasetsModel(currentPage.query)
    project = new Project(currentPage.query)
    projectList = new ProjectList(project)

#    @workspaceName = ko.observable(null)
#    @workspaceNameField = ko.observable(null)
#    new StateManager(this).monitor()

    engine = new Bloodhound
      name: 'placenames'
      local: []
      remote:
        url: '/placenames?q=%QUERY'
        ajax: success: (data) ->
          if data[0]?.use_placename == true && currentPage.query.spatial() != data[0].spatial
            $placenameInputs.trigger 'typeahead:selected', data[0]
      datumTokenizer: -> Bloodhound.tokenizers.whitespace(d.val)
      queryTokenizer: Bloodhound.tokenizers.whitespace

    engine.initialize()

    uiOpts =
      hint: false
      highlight: true
      minLength: 1
    dsOpts =
      name: 'keywords'
      source: engine.ttAdapter()
    $placenameInputs.typeahead(uiOpts, dsOpts)

    currentSpatial = null

    # When the user selects a typeahead value,
    # TODO: Upgrade to typeahead-0.10 when available and verify that typeahead:cursorchanged triggers with arrow keys
    $placenameInputs.on 'typeahead:autocompleted typeahead:selected', (event, datum) ->
      {placename, spatial, value} = datum
      currentPage.query.keywords(value)

      currentPage.query.placename(null)
      currentPage.query.spatial(spatial)
      currentPage.query.placename(placename)
      currentSpatial = spatial

      points = spatial.split(':')
      if points[0] == 'point'
        p1 = points[1].split(',').reverse()
        p2 = p1
      else if points[0] == 'bounding_box'
        p1 = points[1].split(',').reverse()
        p2 = points[2].split(',').reverse()
      $('#map').data('map').map.fitBounds([p1,p2])

    $placenameInputs.on 'keyup', ->
      newValue = $(this).typeahead('val')
      query = currentPage.query
      currentValue = query.keywords()
      unless newValue == currentValue
        query.keywords(newValue)
        placename = query.placename()
        if placename? && newValue.indexOf(placename) == -1
          query.placename(null)
          query.spatial(null)

    readKeywords = (newValue) ->
      $keywords = $('#keywords')
      currentValue = $keywords.typeahead('val')
      unless newValue == currentValue
        $keywords.typeahead('val', newValue ? "")

    readSpatial = (newValue) ->
      currentPlacename = currentPage.query.placename.peek()
      for input in $('.autocomplete-placenames')
        if input.value.indexOf(currentPlacename) != -1 && currentSpatial != null && newValue != currentSpatial
          currentKeywords = currentPage.query.keywords.peek()
          currentPage.query.keywords(currentKeywords.replace(currentPlacename, '').trim())
          currentPage.query.placename('')
        else if currentSpatial == null
          currentSpatial = newValue

    readKeywords(currentPage.query.keywords())
    readSpatial(currentPage.query.spatial())

    currentPage.query.keywords.subscribe readKeywords
    currentPage.query.spatial.subscribe readSpatial

    $placenameInputs.on 'blur', (e) ->
      console.log("---- fire!")
      console.log(datasetsModel)
      href = window.location.href
      if href.match(/search\/granules\?/) # granule list page
        console.log("--------------------- granule list")

        projectList.hideFilters()
        datasetsList.unfocusDataset()

        console.log(currentPage.query)
        params = currentPage.query.params()
        params.page_num = 1
        datasetsModel.search(params)
      else if href.match(/search\/project\?/) # project page
        console.error("--------------------- not implemented")
      else # dataset list page or dataset detail page
        datasetsList.hideDatasetDetails
      $('.master-overlay-main-content').attr('data-level', 0)

      query = this.value
      if !$(e.relatedTarget).hasClass('clear-filters') && query.length > 0 && query.indexOf('place:') != -1
        ajax
          dataType: 'json'
          url: "/placenames?q=#{query}"
          success: (data) =>
            $placenameInputs.trigger 'typeahead:selected', data[0] if data[0]?
