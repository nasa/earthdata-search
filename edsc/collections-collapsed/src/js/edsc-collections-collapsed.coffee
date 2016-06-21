require '../css/collections-collapsed.less'
dom = require 'core/src/dom'
extend = require 'core/src/extend'
async = require 'core/src/async'
domData = ko.utils.domData
domNodeDisposal = ko.utils.domNodeDisposal

class KnockoutComponentModel
  @register: (klass, name, template) ->
    ko.components.register name,
      viewModel:
        createViewModel: (params, componentInfo) -> new klass(params, componentInfo)
      template: template

  constructor: (params, componentInfo) ->
    @_root = componentInfo.element
    @params = params
    extend(this, params)

class CollectionsCollapsedModel extends KnockoutComponentModel
  constructor: (params, componentInfo) ->
    super(params, componentInfo)
    @_scrollParent = dom.scrollParent(@_root)
    @_flyouts = []

    # TODO: This should be cleaner than reaching back to an ancestor
    $?(@_root).closest('.master-overlay').on('edsc.overlaychange', @_hideFlyouts)

    if @_scrollParent
      @_scrollParent.addEventListener('scroll', async.throttled(@_alignFlyouts))

  # These methods should be factored out eventually, as well as master-overlay actions
  hasCollection: (args...) => @page.project.hasCollection(args...)
  toggleCollection: (args...) => @page.ui.projectList.toggleCollection(args...)
  accessCollection: (args...) => @page.ui.projectList.loginAndDownloadCollection(args...)
  canQueryCollectionSpatial: (args...) => @page.ui.collectionsList.canQueryCollectionSpatial(args...)
  spatialQuery: (args...) => @page.query.spatial(args...)
  toggleQueryCollectionSpatial: (args...) => @page.ui.collectionsList.toggleQueryCollectionSpatial(args...)
  showCollectionDetails: (args...) => @page.ui.collectionsList.showCollectionDetails(args...)
  focusCollection: (args...) => @page.ui.collectionsList.focusCollection(args...)
  # End methods to factor out

  _getFlyoutTarget: (e) ->
    target = e.target
    target = target.parentNode until !target || target.getAttribute?('data-flyout')
    target

  toggleFlyout: (context, e) =>
    target = @_getFlyoutTarget(e)
    if domData.get(target, 'flyout') || dom.hasClass(target, 'flyout-visible')
      @hideFlyout(context, e)
      dom.removeClass(target, 'button-active')
    else
      @showFlyout(context, e)
      dom.addClass(target, 'button-active')

  showFlyout: (context, e) =>
    target = @_getFlyoutTarget(e)
    if target && !domData.get(target, 'flyout')
      @hideFlyout(context, e)
      dom.addClass(target, 'flyout-visible')
      template = target.getAttribute('data-flyout')
      flyout = dom.stringToNode(require("../html/#{template}.html"))
      domData.set(target, 'flyout', flyout)
      @_flyouts.push(flyout)
      ko.applyBindings(context, flyout)
      parent = listItem = target
      listItem = listItem.parentNode until dom.hasClass(listItem, 'ccol')
      if dom.hasClass(target, 'flyout-tooltip-button')
        dom.addClass(flyout, 'flyout-tooltip')
      else
        parent = listItem
      listOffset = @_offset(listItem, document.body)
      parentOffset = @_offset(parent, document.body)
      flyout.style.top = parentOffset.top + 'px'
      flyout.style.left = listOffset.left + listItem.clientWidth + 'px'
      @_alignFlyouts()
      document.body.appendChild(flyout)
      domNodeDisposal.addDisposeCallback target, => @_destroyFlyout(target)


  _alignFlyouts: =>
    scroll = @_scrollParent?.scrollTop ? 0
    for flyout in @_flyouts
      prevScroll = domData.get(flyout, 'flyout-scroll') || 0
      domData.set(flyout, 'flyout-scroll', scroll)
      if prevScroll != scroll
        top = parseInt(flyout.style.top)
        flyout.style.top = (top + prevScroll - scroll) + 'px'


  # Finds vertical distance from the top of parent to the top of el,
  # traversing offsetParents
  _offset: (el, parent) ->
    top = -parent.offsetTop
    left = -parent.offsetLeft
    parent = parent.offsetParent if top != 0 || left != 0
    while el && el != parent
      top += el.offsetTop
      left += el.offsetLeft
      el = el.offsetParent
    {top: top, left: left}

  _destroyFlyout: (target) ->
    flyout = domData.get(target, 'flyout')
    @_removeFlyoutNode(flyout) if flyout

  _removeFlyoutNode: (flyout) ->
    index = @_flyouts.indexOf(flyout)
    @_flyouts.splice(index, 1) if index != -1
    domData.clear(flyout)
    dom.remove(flyout)

  _hideFlyouts: (e) =>
    els = Array.prototype.slice.call(@_root.getElementsByClassName('flyout-visible'));
    for target in els
      @hideFlyout(null, target: target)

  hideFlyout: (context, e) =>
    target = @_getFlyoutTarget(e)
    if target
      @_destroyFlyout(target)
      dom.removeClass(target, 'flyout-visible')
      domData.set(target, 'flyout', null)

ccolsHtml = require('../html/collections-collapsed.html')
KnockoutComponentModel.register(CollectionsCollapsedModel, 'edsc-collections-collapsed', ccolsHtml)

ko.bindingHandlers.divSpatial =
  update: (element, valueAccessor, allBindings) ->
    value = valueAccessor()
    mbr = ko.unwrap(value).getMbr()

    spatialDiv = element.firstElementChild
    if !spatialDiv
      spatialDiv = document.createElement('DIV')
      element.appendChild(spatialDiv)

    if !mbr
      dom.setStyles(spatialDiv, display: 'none')
      return

    mapWidth = parseInt(dom.getStyle(element, 'width'))
    mapHeight = parseInt(dom.getStyle(element, 'height'))

    border = 2

    latToPx = (lat) -> Math.floor((180 - (90 + lat)) * mapHeight / 180)
    lngToPx = (lng) -> Math.floor((180 + lng) * mapWidth / 360)

    top = latToPx mbr.getNorth()
    left = lngToPx mbr.getWest()
    width = lngToPx(mbr.getEast()) - left
    height = latToPx(mbr.getSouth()) - top

    # Adjust positionining of small boxes to better center on their area
    if width < border
      width = border * 2
      left -= border

    if height < border
      height = border * 2
      top -= border

    dom.setStyles(spatialDiv, display: 'block', top: top + 'px', left: left + 'px', width: width + 'px', height: height + 'px')
    null
