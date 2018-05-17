#= require models/data/collections
#= require models/data/query

models = @edsc.models
data = models.data
ns = models.ui

ns.FullFacetsList = do (ko
                          document
                          $ = jQuery
                          CollectionFacetsModel = ns.CollectionFacets
                          CollectionsModel = data.Collections
                          extend = $.extend
                        ) ->

  # Map the facet category titles to the CMR params for facet-size
  facet_category_mappings = {
    'Organizations': 'data-center',
    'Processing levels': 'processing-level-id',
    'Keywords': 'science-keywords',
    'Instruments': 'instrument',
    'Platforms': 'platform',
    'Projects': 'project'
  }

  class FullFacetsList
    constructor: ->
      @facetObjects = ko.computed(@_computeSelectedFacets, this, deferEvaluation: true)

      @selectedFacetCategory = ko.observable(null)

      @alphabet = ['#','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

      @selectedFacetCategory.subscribe (selectedFacetCategory) =>
        # The observable is disposed of on modal close
        return if selectedFacetCategory == null

        # Ask CMR for stuff
        @_retrieveFacets(selectedFacetCategory)

      $(document).ready(@_onReady)

    _onReady: =>
      @_scrollToItem()

    _scrollToItem: =>
      $('body').on 'click', 'a.modal-content-header-alpha-item', (event) ->
        if this.hash != ''
          event.preventDefault();
          hash = this.hash
          container = $(hash).parents('.modal-body-view-all-facets')
          offset = $(hash)[0].offsetTop

          container.animate({
            scrollTop: offset
          }, 300)

    _retrieveFacets: (facetCategory) =>
      category_key = facet_category_mappings[facetCategory.title]

      queryModel = facetCategory.queryModel

      queryModel.params().facets_size = {}
      queryModel.params().facets_size[category_key] = 10000

      @collections = new CollectionsModel(queryModel)

      # This method retrieves the collections (and therefore facets)
      @collections.results()

    _computeSelectedFacets: =>
      for facet in @collections.facets.results()
        if facet.title == @selectedFacetCategory().title
          return @_groupFacetsAlphabetically(facet.children())

    # Groups facets by the first character for the UI
    _groupFacetsAlphabetically: (facets) ->
      alphabetizedList = {}
      groupedList = []

      for letter in @alphabet
        alphabetizedList[letter] = []

      for facet in facets
        if !isNaN(facet.title[0])
          alphabetizedList['#'].push facet
        else
          alphabetizedList[facet.title[0].toUpperCase()].push facet

      for group of alphabetizedList
        groupedList.push {letter: group, facets: alphabetizedList[group]}

      groupedList

  exports = FullFacetsList
