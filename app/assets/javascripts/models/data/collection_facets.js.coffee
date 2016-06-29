#= require models/data/xhr_model

ns = @edsc.models.data

ns.CollectionFacets = do (ko) ->

  facet_categories = ['features',
    'science_keywords[0][category]',
    'science_keywords[0][topic]',
    'science_keywords[0][term]',
    'science_keywords[0][variable_level_1]',
    'science_keywords[0][variable_level_2]',
    'science_keywords[0][variable_level_3]',
    'science_keywords[0][detailed_variable]',
    'platform',
    'instrument',
    'data_center',
    'project',
    'processing_level_id']

  class Facet
    constructor: (@parent, item) ->
      @title = item.title
      @type = item.type
      @hasChildren = ko.observable(item.has_children)
      @links = item.links
      @children = item.children
      @isSelected = ko.observable(item.applied)
      @count = ko.observable(item.count)
      @param = @_linksToParam(@links)

    _linksToParam: (links) ->
      return category for category in facet_categories when links.apply?.replace(/%5B/g, '[').replace(/%5D/g, ']').indexOf(category) > 0

    isChild: ->
      # applied: true && links: {remove: https://...}
      @links.remove?.length > 0 && @isSelected()

    isParent: ->
      # applied: true && one of the children has links.remove set
      hasChild = false
      for child in @children?
        if child.links.remove?.length > 0
          hasChild = true
          break

      hasChild && @isSelected()

    isAncestor: ->
      # applied: true && links: {apply: https://...}
      @links.apply?.length > 0 && @isSelected()

    isScienceKeyword: ->
      @param.indexOf('sci') == 0

    isScienceKeywordParent: ->
      (@isAncestor() &&
       @hierarchyIndex() >= @parent.queryModel.scienceKeywordFacets().length - 1)

    isHierarchical: ->
      @isScienceKeyword()

    equals: (other) ->
      other && other.title == @title && other.param == @param

  class FacetsListModel
    constructor: (@queryModel, item) ->
      @title = item.title
      @class_name = ko.computed => @title.toLowerCase().replace(' ', '-')
      @param = item.param

      children = (new Facet(this, child) for child in item.children)

      @children = ko.observable(children)
      @selectedValues = ko.computed(@_loadSelectedValues)

      isDefaultOpened = (@selectedValues().length > 0 ||
                         item.title == 'Keywords' ||
                         item.title == 'Features')
      @opened = ko.observable(isDefaultOpened)
      @closed = ko.computed => !@opened()

    setValues: (newValues) =>
      facetsByTitle = {}
      for facet in @children()
        facetsByTitle[facet.title] = facet
      values = []
      for newFacetData in newValues
        oldFacet = facetsByTitle[newFacetData.title]
        newFacet = new Facet(this, newFacetData)
        if newFacet.equals(oldFacet)
          oldFacet.count(newFacetData.count)
          values.push(oldFacet)
        else
          values.push(newFacet)
      @children(values)

    _loadSelectedValues: =>
      facet for facet in @children() when facet.isSelected()

    removeHierarchyBelow: (facet) ->
      index = facet.hierarchyIndex()
      removed = (v for v in @children() when v.hierarchyIndex() > index)
      @children(v for v in @children() when v.hierarchyIndex() <= index)
      removed

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
          children = item.children
          children.parent = found for child in item.children
          found.setValues(item.children)
        else
          current.push(new FacetsListModel(@query, item))

      @results(current)
      current

    removeFacet: (facet) =>
      @_removeSingleFacet(facet)
      for facet in facet.parent.removeHierarchyBelow(facet) when facet.isSelected()
        @_removeSingleFacet(facet)

    _removeSingleFacet: (facet) ->
      title = facet.title
      param = facet.param
      @query.facets.remove (queryFacet) ->
        queryFacet.title == title && queryFacet.param == param

    addFacet: (facet) =>
      @query.facets([]) unless @query.facets()?
      @query.facets.push(title: facet.title, param: facet.param)

    toggleFacet: (facet) =>
      if facet.isSelected()
        facet.isSelected(false)
        @removeFacet(facet)
      else
        facet.isSelected(true)
        @addFacet(facet)

  exports = CollectionFacetsModel
