require '../css/collections-collapsed.less'
dom = require 'core/src/dom'
extend = require 'core/src/extend'
events = require 'core/src/events'

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

class CollectionCollapsedModel extends KnockoutComponentModel
  constructor: (params, componentInfo) ->
    super(params, componentInfo)
    parent = @parent
    @page = parent.page
    @isProject = parent.isProject

  _getFlyoutTarget: (e) ->
    target = e.target
    target = target.parentNode until !target || flyout = target.getAttribute('data-flyout')
    target

  toggleFlyout: (context, e) =>
    target = @_getFlyoutTarget(e)
    if ko.utils.domData.get(target, 'flyout') || dom.hasClass(target, 'flyout-visible')
      @hideFlyout(context, e)
      dom.removeClass(target, 'button-active')
    else
      @showFlyout(context, e)
      dom.addClass(target, 'button-active')

  showFlyout: (context, e) =>
    target = @_getFlyoutTarget(e)
    if target && !ko.utils.domData.get(target, 'flyout')
      @hideFlyout(context, e)
      dom.addClass(target, 'flyout-visible')
      template = target.getAttribute('data-flyout')
      flyout = dom.stringToNode(require("../html/#{template}.html"))
      ko.utils.domData.set(target, 'flyout', flyout)
      ko.applyBindings(context, flyout)
      parent = @_root.firstElementChild
      if dom.hasClass(target, 'flyout-tooltip-button')
        flyout.style.top = @_relativeTop(target, parent) + 'px'
        dom.addClass(flyout, 'flyout-tooltip')
      parent.appendChild(flyout)

  # Finds vertical distance from the top of parent to the top of el,
  # traversing offsetParents
  _relativeTop: (el, parent) ->
    top = -parent.offsetTop
    parent = parent.offsetParent if top != 0
    while el && el != parent
      top += el.offsetTop
      el = el.offsetParent
    top

  hideFlyout: (context, e) =>
    target = @_getFlyoutTarget(e)
    if target
      dom.remove(ko.utils.domData.get(target, 'flyout'))
      dom.removeClass(target, 'flyout-visible')
      ko.utils.domData.set(target, 'flyout', null)

ccolsHtml = require('../html/collections-collapsed.html')
KnockoutComponentModel.register(CollectionsCollapsedModel, 'edsc-collections-collapsed', ccolsHtml)

ccolHtml = require('../html/collection-collapsed.html')
KnockoutComponentModel.register(CollectionCollapsedModel, 'edsc-collection-collapsed', ccolHtml)
