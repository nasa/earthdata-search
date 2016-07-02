#= require models/data/xhr_model

ns = @edsc.models.data

ns.CollectionFacets = do (ko) ->

  facet_matchers = ['features=[^&]+',
    'science_keywords\\[\\d*\\]\\[category\\]=[^&]+',
    'science_keywords\\[\\d*\\]\\[topic\\]=[^&]+',
    'science_keywords\\[\\d*\\]\\[term\\]=[^&]+',
    'science_keywords\\[\\d*\\]\\[variable_level_1\\]=[^&]+',
    'science_keywords\\[\\d*\\]\\[variable_level_2\\]=[^&]+',
    'science_keywords\\[\\d*\\]\\[variable_level_3\\]=[^&]+',
    'science_keywords\\[\\d*\\]\\[detailed_variable\\]=[^&]+',
    'platform\\[\\]=[^&]+',
    'instrument\\[\\]=[^&]+',
    'data_center\\[\\]=[^&]+',
    'project\\[\\]=[^&]+',
    'processing_level_id\\[\\]=[^&]+']

  facet_param_to_title = {
    'features': 'Features',
    'science_keywords': 'Keywords',
    'platform': 'Platforms',
    'instrument': 'Instruments',
    'data_center': 'Organizations',
    'project': 'Projects',
    'processing_level_id': 'Processing levels'}

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
            params.push match.split('=')[0] for key of facet_param_to_title when match.indexOf(key) > -1 && match.indexOf(encodeURIComponent(@title).replace(/%20/g, '+').replace(/\(/g, "%28").replace(/\)/g, "%29")) > -1
      params

    isFeature: =>
      @parent.title == 'Features'

    isChild: =>
      !@isFeature() && !@isAncestor() && @hierarchyIndex() > 1 && @_scienceKeywordFacet()

    isParent: =>
      !@isFeature() && @isAncestor() && @_noChildrenSelected()

    isAncestor: =>
      !@isFeature() && @isSelected() && @links.remove?.length > 0

    _noChildrenSelected: =>
      return false for child in @children when child.applied if @children
      return true

    hierarchyIndex: =>
      for matcher, index in facet_matchers
        queryParamRegex = matcher.split('=')[0]
        regex = new RegExp(queryParamRegex, 'g')
        if @param.length > 0 && @param[0].match(regex)
          return index
      return -1

    _scienceKeywordFacet: =>
      @param[0].indexOf('science_keywords') > -1

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
          @_findAncestors(ancestors, item)
          parent = ancestors.slice(-1)[0]
          if parent
            children.push new Facet(this, ancestor) for ancestor in ancestors
            children.push new Facet(this, grandChild) for grandChild in parent.children if parent.children
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

      @results(current)
      current

    _findAncestors: (ancestors, item) ->
      ancestors.push item if item.applied && item.type == 'filter'
      if item.children
        for child in item.children
          if child.applied && child.links.remove?.length > 0
            @_findAncestors(ancestors, child)

    removeFacet: (facet) =>
      @_removeSingleFacet(facet)
      @_removeHierarchicalFacets(facet)

    _removeHierarchicalFacets: (root) ->
      if root.children
        for child in root.children
          if child.applied
            title = child.title
            @query.facets.remove (queryFacet) ->
              queryFacet.title == title
            @_removeHierarchicalFacets(child)


    _removeSingleFacet: (facet) ->
      title = facet.title
      param = facet.param
      @query.facets.remove (queryFacet) ->
        queryFacet.title == title

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
