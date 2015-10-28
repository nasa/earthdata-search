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
  toggleFlyout: (args...) =>
    if @_flyout
      @hideFlyout(args...)
    else
      @showFlyout(args...)

  _getFlyoutTarget: (e) ->
    target

  showFlyout: (context, e) =>
    @hideFlyout()
    target = e.target
    target = target.parentNode until !target || flyout = target.getAttribute('data-flyout')
    @_flyoutTarget = target
    if target
      dom.addClass(target, 'flyout-visible')
      console.log target
      @_flyout = dom.stringToNode(require("../html/#{flyout}.html"))
      ko.applyBindings(context, @_flyout)
      @_root.firstElementChild.appendChild(@_flyout)

  hideFlyout: =>
    if @_flyoutTarget
      dom.removeClass( @_flyoutTarget, 'flyout-visible')
      @_flyoutTarget = null
    dom.remove(@_flyout)
    @_flyout = null

ccolsHtml = require('../html/collections-collapsed.html')
KnockoutComponentModel.register(CollectionsCollapsedModel, 'edsc-collections-collapsed', ccolsHtml)

ccolHtml = require('../html/collection-collapsed.html')
KnockoutComponentModel.register(CollectionCollapsedModel, 'edsc-collection-collapsed', ccolHtml)
