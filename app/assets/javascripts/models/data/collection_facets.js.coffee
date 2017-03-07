#= require models/data/xhr_model

ns = @edsc.models.data

ns.CollectionFacets = do (ko, currentPage = window.edsc.models.page.current) ->

  facet_matchers = ['features=[^&]+',
    'science_keywords_h\\[\\d*\\]\\[category\\]=[^&]+',
    'science_keywords_h\\[\\d*\\]\\[topic\\]=[^&]+',
    'science_keywords_h\\[\\d*\\]\\[term\\]=[^&]+',
    'science_keywords_h\\[\\d*\\]\\[variable_level_1\\]=[^&]+',
    'science_keywords_h\\[\\d*\\]\\[variable_level_2\\]=[^&]+',
    'science_keywords_h\\[\\d*\\]\\[variable_level_3\\]=[^&]+',
    'science_keywords_h\\[\\d*\\]\\[detailed_variable\\]=[^&]+',
    'platform_h\\[\\]=[^&]+',
    'instrument_h\\[\\]=[^&]+',
    'data_center_h\\[\\]=[^&]+',
    'project_h\\[\\]=[^&]+',
    'processing_level_id_h\\[\\]=[^&]+']

  facet_param_to_title = {
    'features': 'Features',
    'science_keywords_h': 'Keywords',
    'platform_h': 'Platforms',
    'instrument_h': 'Instruments',
    'data_center_h': 'Organizations',
    'project_h': 'Projects',
    'processing_level_id_h': 'Processing levels'}

  class Facet
    constructor: (@parent, item) ->
      @title = item.title
      @type = item.type
      @hasChildren = ko.observable(item.has_children)
      @termFacet = ko.observable(false)
      @var1Facet = ko.observable(false)
      @var2Facet = ko.observable(false)
      @var3Facet = ko.observable(false)
      @links = item.links
      @children = item.children
      @isSelected = ko.observable(item.applied)
      @isChecked ?= ko.observable(item.applied)
      @count = ko.observable(item.count)
      @param = @_linksToParam()

    _linksToParam: =>
      params = []
      if @parent.title == 'Features'
        params.push 'features'
      else if @links.apply?
        link = @links.apply.replace(/%5B/g, '[').replace(/%5D/g, ']')

      if !link && @parent.title == 'Keywords'
        # hierarchical facet is applied and there is no applicable link
        query = window.edsc.models.page.current.query
        i = 0
        appliedKeywordsHash = query.params()['science_keywords_h']
        for appliedKeyword, i in appliedKeywordsHash
          Object.keys(appliedKeywordsHash[i]).forEach (key) =>
            title = appliedKeywordsHash[i][key]
            params.push "science_keywords_h[#{i}][#{key}]" if title == @title
        return params if params.length > 0

      for category in facet_matchers
        regex = new RegExp(category, 'g')
        if link?.match(regex)
          for match in link.match(regex)
            for key of facet_param_to_title
              [param, value] = match.split('=')
              if param.indexOf(key) > -1 && value == encodeURIComponent(@title).replace(/%20/g, '+').replace(/\(/g, "%28").replace(/\)/g, "%29")
                params.push match.split('=')[0]
      params

    isFeature: =>
      @parent.title == 'Features'

    isAncestor: =>
      !@isFeature() && @isSelected() && @hasChildren()

# NO NEED topic uses default css facets-item style
#    isTopic: =>
#      !@isFeature() && @_hierarchyIndex() == 2 && @_scienceKeywordFacet()

    isTerm: =>
      return true if @termFacet()
      value = !@isFeature() && @_hierarchyIndex() == 3 && @_scienceKeywordFacet()
      @termFacet(value)
      value

    isVar1: =>
      return true if @var1Facet()
      value = !@isFeature() && @_hierarchyIndex() == 4 && @_scienceKeywordFacet()
      @var1Facet(value)
      value

    isVar2: =>
      return true if @var2Facet()
      value = !@isFeature() && @_hierarchyIndex() == 5 && @_scienceKeywordFacet()
      @var2Facet(value)
      value

    isVar3: =>
      return true if @var3Facet()
      value = !@isFeature() && @_hierarchyIndex() == 6 && @_scienceKeywordFacet()
      @var3Facet(value)
      value

    _hierarchyIndex: =>
      for matcher, index in facet_matchers
        queryParamRegex = matcher.split('=')[0]
        regex = new RegExp(queryParamRegex, 'g')
        if @param.length > 0 && @param[0].match(regex)
          return index
      return -1

    _scienceKeywordFacet: =>
      @param[0].indexOf('science_keywords_h') > -1

    equals: (other) ->
      other && other.title == @title && other.param == @param

  class FacetsListModel
    constructor: (@queryModel, item) ->
      @title = item.title
      @class_name = ko.computed => @title.toLowerCase().replace(' ', '-')
      @param = item.param

      children = @_addAncestorsToFacetsList(item)
      @children = ko.observable(children)
      @selectedValues = ko.computed(@_loadSelectedValues)

      isDefaultOpened = (@selectedValues().length > 0 ||
                         item.title == 'Keywords' ||
                         item.title == 'Features')
      @opened = ko.observable(isDefaultOpened)
      @closed = ko.computed => !@opened()

    _addAncestorsToFacetsList: (item) ->
      children = []
      ancestors = []
      for child in item.children
        if item.title == 'Features'
          facets = @queryModel.facets()
          if facets && facets.length > 0
            featureQuery = facets.find (queryParam) ->
              child.title == queryParam.title
            child.applied = true if featureQuery
          children.push(new Facet(this, child))
        else if item.title == 'Keywords'
          if child.applied
            @_findAncestors(ancestors, child)
            parent = ancestors.slice(-1)[0]
            if parent
              children.push new Facet(this, ancestor) for ancestor in ancestors
              ancestors = []
              if parent.children
                children.push new Facet(this, grandChild) for grandChild in parent.children
              else if parent.count == 0
                continue
            index = item.children.indexOf(child)
            item.children[index] = null if index > -1
        else
          children.push new Facet(this, child)

      if item.title == 'Keywords'
        children.push new Facet(this, child) for child in item.children when child? && child.count > 0


      children

    _findAncestors: (ancestors, item) ->
      ancestors.push item if item.applied && item.type == 'filter' && item.links.remove?.length > 0
      if item.children
        for child in item.children
          if child.applied && child.links.remove?.length > 0
            @_findAncestors(ancestors, child)

    setValues: (item) =>
      newValues = @_addAncestorsToFacetsList(item)

      facetsByTitle = {}
      for facet in @children()
        facetsByTitle[facet.title] = facet
      values = []
      for newFacet in newValues
        oldFacet = facetsByTitle[newFacet.title]
        if newFacet.equals(oldFacet)
          oldFacet.count(newFacet.count)
          values.push(oldFacet)
        else
          values.push(newFacet)
      @children(values)

    _loadSelectedValues: =>
      facet for facet in @children() when facet.isSelected()

    toggleList: =>
      @opened(!@opened())

  class CollectionFacetsModel
    constructor: (query) ->
      @query = query
      @isRelevant = ko.observable(false)
      @appliedFacets = ko.computed(@_computeAppliedFacets, this, deferEvaluation: true)
      @results = ko.observable([])

    _computeAppliedFacets: ->
      result for result in @results() when result.selectedValues().length > 0

    update: (data) ->
      current = @results.peek()
      updated = []
      for item, index in data
        found = ko.utils.arrayFirst current, (result) ->
          result.title == item.title
        if found
          found.setValues(item)
          updated[index] = found
        else
          updated[index] = new FacetsListModel(@query, item)

      # Remove 'current' facetsList that are not returned from CMR (e.g. after 'atmosphere -> cloud -> cloud properties'
      # being applied, CMR will not return 'processing_level_id_h' in facet-v2 since no collections have any process level
      # id info.
      currentLen = updated.length
      i = 0
      while i < currentLen
        currentFacetList = updated[i]
        found = ko.utils.arrayFirst data, (result) ->
          result.title == currentFacetList.title
        updated.splice(updated.indexOf(currentFacetList), 1) unless found
        currentLen = updated.length
        i++

      @results(updated)
      updated

    _findAncestors: (ancestors, item) ->
      ancestors.push item if item.applied && item.type == 'filter'
      if item.children
        for child in item.children
          if child.applied && child.links.remove?.length > 0
            @_findAncestors(ancestors, child)

    removeFacet: (facet) =>
      @_removeSingleFacet(facet)
      @_removeHierarchicalFacets(facet)

    _removeSingleFacet: (root) ->
      rootLevel = -1
      for facetParam in @query.facets()
        if facetParam.title == root.title
          rootLevel = parseInt(facetParam.param.split(/(?:\]?\[|\]$)/)[1])
          # science_keywords_h are always hierarachical, so we want root to be NaN
          if facetParam.param.indexOf 'science_keywords_h' > -1
            rootLevel = NaN
          break;
      if isNaN(rootLevel)
        @query.facets.remove (facet) ->
          facet.title == root.title
      else
        @query.facets.remove (facet) ->
          parseInt(facet.param.split(/(?:\]?\[|\]$)/)[1]) >= rootLevel

    _removeHierarchicalFacets: (root) ->
      if root.children
        hasAppliedChildren = false
        for child in root.children
          if child.applied
            hasAppliedChildren = true
            title = child.title
            @query.facets.remove (queryFacet) ->
              queryFacet.title == title
            @_removeHierarchicalFacets(child)
        @query.facets.remove (queryFacet) -> queryFacet.title == root.title unless hasAppliedChildren
        params = @query.params()
        if params['science_keywords_h']
          (tmp or tmp = []).push sk for sk in params['science_keywords_h'] when sk
          params['science_keywords_h'] = tmp



    addFacet: (facet) =>
      @query.facets([]) unless @query.facets()?
      for param in facet.param
        @query.facets.push(title: facet.title, param: param)
      @query.facets()

    toggleFacet: (facet) =>
      if facet.isSelected()
        facet.isChecked(false)
        @removeFacet(facet)
      else
        facet.isChecked(true)
        @addFacet(facet)
      true

  exports = CollectionFacetsModel
