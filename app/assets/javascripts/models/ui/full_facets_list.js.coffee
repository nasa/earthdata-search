#= require models/data/collections
#= require models/data/collection_facets
#= require models/data/query

models = @edsc.models
data = models.data
ns = models.ui

ns.FullFacetsList = do (ko
                          document
                          $ = jQuery
                          extend = $.extend

                          CollectionQuery = data.query.CollectionQuery
                          CollectionsModel = data.Collections
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

  alphabet = ['#','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

  class AllFacetsCollectionsModel extends CollectionsModel
    # Override the constructor to allow us to provide the selectedFacetCategory
    # for constructing the params necessary
    constructor: (query, @selectedFacetCategory) ->
      super(query)

    params: ->
      category_key = facet_category_mappings[@selectedFacetCategory.title]

      parameters = {}
      parameters.facets_size = {}
      parameters.facets_size[category_key] = 10000

      extend(parameters, super())

  class FullFacetsList
    constructor: (@parentQuery) ->
      # Facet objects displayed within the modal
      @facetsForSelectedCategory = ko.computed(@_computeSelectedFacets, this, deferEvaluation: true)

      @selectedFacetCategory = ko.observable(null)

      @selectedFacetCategory.subscribe (selectedFacetCategory) =>
        # The observable is disposed of on modal close so we don't
        # want to attempt to do anything with an empty value
        return if selectedFacetCategory == null

        @_retrieveFacets()

      $(document).ready(@_onReady)

    _onReady: =>
      @_scrollToItem()

    # Scroll to the desired section of the based on the first character of the facet
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

    # Retrieves the collections and associated facets from CMR and
    # then runs them through the method to organize them for the UI
    _computeSelectedFacets: =>
      for facet in @collections.facets.results()
        if facet.title == @selectedFacetCategory().title
          return @_groupFacetsAlphabetically(facet.children())

    # Construct the necessary objects to and ping CMR to retrieve collections and their facets
    _retrieveFacets: =>
      # Rather than using the provided query we'll copy its contents as to not
      # update the provided object in the modal
      copiedQuery = new CollectionQuery()
      copiedQuery.fromJson(@selectedFacetCategory().queryModel.serialize())

      # Instantiate our custom CollectionsModel with the copied query
      # object and selected facetCategory
      @collections = new AllFacetsCollectionsModel(copiedQuery, @selectedFacetCategory())

      # This method retrieves the collections (and therefore facets)
      @collections.results()

    # Groups facets by the first character for the UI
    _groupFacetsAlphabetically: (facets) ->
      alphabetizedList = {}
      groupedList = []

      for letter in alphabet
        alphabetizedList[letter] = []

      for facet in facets
        if !isNaN(facet.title[0])
          alphabetizedList['#'].push facet
        else
          alphabetizedList[facet.title[0].toUpperCase()].push facet

      for group of alphabetizedList
        groupedList.push {letter: group, facets: alphabetizedList[group]}

      groupedList

    # Applies the selected facets from the modal to the searchQuery
    # provided during instantiation
    applyFacetsToSearch: =>
      @parentQuery.fromJson(@collections.query.serialize())

  exports = FullFacetsList
