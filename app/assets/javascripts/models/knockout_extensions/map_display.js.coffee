do (ko, $=jQuery) ->

  ko.bindingHandlers.mapdisplay =
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
    update: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
      element.removeChild(element.firstChild) while element.firstChild

      bounds = ko.unwrap(valueAccessor())
      if bounds
        [min_lat, min_lng, max_lat, max_lng] = bounds
        mbr = document.createElement('div')
        mbr.className = 'access-mbr'
        borderWidth = 2
        mbr.style.top = Math.round(-max_lat + 90 - borderWidth) + 'px'
        mbr.style.left = Math.round(min_lng + 180 - borderWidth) + 'px'
        mbr.style.height = Math.round(max_lat - min_lat + 2*borderWidth) + 'px'
        mbr.style.width = Math.round(max_lng - min_lng + 2*borderWidth) + 'px'
        element.appendChild(mbr)
