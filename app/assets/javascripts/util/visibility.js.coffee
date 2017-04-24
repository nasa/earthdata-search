@edsc.util.visibility = do ->

  isElementInViewPort = (el) ->
    rect = el.getBoundingClientRect()
    rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)

  exports =
    isElementInViewPort: isElementInViewPort
