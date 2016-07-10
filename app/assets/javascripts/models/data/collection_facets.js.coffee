#= require models/data/xhr_model

ns = @edsc.models.data

ns.CollectionFacets = do (ko) ->

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
      @links = item.links
      @children = item.children
      @isSelected = ko.observable(item.applied)
      @count = ko.observable(item.count)
      @param = @_linksToParam()

    _linksToParam: =>
      params = []
      if @parent.title == 'Features'
        params.push 'features'
      else if @links.apply?
        link = @links.apply.replace(/%5B/g, '[').replace(/%5D/g, ']')
      else
        link = @links.remove.replace(/%5B/g, '[').replace(/%5D/g, ']')
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

    isChild: =>
      !@isFeature() && !@isAncestor() && @hierarchyIndex() > 2 && @_scienceKeywordFacet()

    isParent: =>
      !@isFeature() && @isAncestor() && @_noChildrenSelected()

    isAncestor: =>
      !@isFeature() && @isSelected() && @links.remove?.length > 0

    _noChildrenSelected: =>
      if @children
        return false for child in @children when child.applied
        return true
      else
        return false

    hierarchyIndex: =>
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
          featureQuery = @queryModel.facets().find (queryParam) ->
            child.title == queryParam.title
          if featureQuery
            child.applied = true
          children.push new Facet(this, child)
        else if child.applied
          if item.title == 'Keywords'
            @_findAncestors(ancestors, item)
            parent = ancestors.slice(-1)[0]
            if parent
              children.push new Facet(this, ancestor) for ancestor in ancestors
              if parent.children
                children.push new Facet(this, grandChild) for grandChild in parent.children
              else
                break
          else
            children.push new Facet(this, child)
        else
          children.push new Facet(this, child)
      children

    _findAncestors: (ancestors, item) ->
      ancestors.push item if item.applied && item.type == 'filter'
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
      for item in data
        found = ko.utils.arrayFirst current, (result) ->
          result.title == item.title
        if found
          found.setValues(item)
        else
          current.push(new FacetsListModel(@query, item))

      # Remove 'current' facetsList that are not returned from CMR (e.g. after 'atmosphere -> cloud -> cloud properties'
      # being applied, CMR will not return 'processing_level_id_h' in facet-v2 since no collections have any process level
      # id info.
      currentLen = current.length
      i = 0
      while i < currentLen
        currentFacetList = current[i]
        found = ko.utils.arrayFirst data, (result) ->
          result.title == currentFacetList.title
        current.splice(current.indexOf(currentFacetList), 1) unless found
        currentLen = current.length
        i++

      @results(current)
      current

    _findAncestors: (ancestors, item) ->
      ancestors.push item if item.applied && item.type == 'filter'
      if item.children
        for child in item.children
          if child.applied && child.links.remove?.length > 0
            @_findAncestors(ancestors, child)

    removeFacet: (facet) =>
#      @_removeSingleFacet(facet)
      @_removeHierarchicalFacets(facet)

    _removeHierarchicalFacets: (root) ->
      if root.children
        for child in root.children
          if child.applied
            title = child.title
            @query.facets.remove (queryFacet) ->
              queryFacet.title == title
            @_removeHierarchicalFacets(child)
      else
        rootLevel = -1
        for facetParam in @query.facets()
          if facetParam.title == root.title
            rootLevel = parseInt(facetParam.param.split(/(?:\]?\[|\]$)/)[1])
            break;
        if isNaN(rootLevel)
          @query.facets.remove (facet) ->
            facet.title == root.title
        else
          @query.facets.remove (facet) ->
            parseInt(facet.param.split(/(?:\]?\[|\]$)/)[1]) >= rootLevel

    addFacet: (facet) =>
      @query.facets([]) unless @query.facets()?
      for param in facet.param
        @query.facets.push(title: facet.title, param: param)
      @query.facets()

    toggleFacet: (facet) =>
      if facet.isSelected()
        @removeFacet(facet)
      else
        @addFacet(facet)

  exports = CollectionFacetsModel
