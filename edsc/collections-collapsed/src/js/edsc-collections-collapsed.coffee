require '../css/collections-collapsed.less'
{extend, dom} = require('core')

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

  _getFlyoutTarget: (e) ->
    target = e.target
    target = target.parentNode until !target || flyout = target.getAttribute('data-flyout')
    target

  toggleFlyout: (context, e) =>
    target = @_getFlyoutTarget(e)
    if ko.utils.domData.get(target, 'flyout') || dom.hasClass(target, 'flyout-visible')
      @hideFlyout(context, e)
    else
      @showFlyout(context, e)

  showFlyout: (context, e) =>
    target = @_getFlyoutTarget(e)
    if target
      @hideFlyout(context, e)
      dom.addClass(target, 'flyout-visible')
      template = target.getAttribute('data-flyout')
      flyout = dom.stringToNode(require("../html/#{template}.html"))
      ko.utils.domData.set(target, 'flyout', flyout)
      ko.applyBindings(context, flyout)
      @_root.firstElementChild.appendChild(flyout)

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
