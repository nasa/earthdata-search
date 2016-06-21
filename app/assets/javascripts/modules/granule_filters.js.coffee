do ($ = jQuery) ->

  $(document).on 'click', 'a.search-granules-multiple', ->
    content = $(this).parents('.granule-id-search')
    content.removeClass("search-single")
    content.addClass("search-multiple")

  $(document).on 'click', 'a.search-granules-one', ->
    content = $(this).parents('.granule-id-search')
    content.addClass("search-single")
    content.removeClass("search-multiple")
