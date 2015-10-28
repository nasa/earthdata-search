require '../css/collections-collapsed.less'
dom = require 'core/src/dom'
extend = require 'core/src/extend'
events = require 'core/src/events'

sortable = (root, rowClass) ->
    $root = $(root)
    $placeholder = $("<li class=\"sortable-placeholder #{rowClass}\"/>")

    index = null
    $dragging = null

    $root.on 'dragstart.sortable', '> *', (e) ->
      dt = e.originalEvent.dataTransfer;
      dt.effectAllowed = 'move';
      dt.setData('Text', 'dummy');
      $dragging = $(this)
      index = $dragging.index();

    $root.on 'dragend.sortable', '> *', (e) ->
      $dragging.show()
      $placeholder.detach()
      startIndex = index
      endIndex = $dragging.index()
      if startIndex != endIndex
        $root.trigger('sortupdate', startIndex: startIndex, endIndex: endIndex)
      $dragging = null

    $root.on 'drop.sortable', '> *', (e) ->
      e.stopPropagation()
      $placeholder.after($dragging)
      false

    $root.on 'dragover.sortable dragenter.sortable', '> *', (e) ->
      e.preventDefault()
      e.originalEvent.dataTransfer.dropEffect = 'move';
      $dragging.hide().appendTo($root) # appendTo to ensure top margins are ok
      if $placeholder.index() < $(this).index()
        $(this).after($placeholder)
      else
        $(this).before($placeholder)
      false

class KnockoutComponentModel
  @register: (klass, name, template) ->
    console.log ko
    ko.components.register name,
      viewModel:
        createViewModel: (params, componentInfo) -> new klass(params, componentInfo)
      template: template

  constructor: (params, componentInfo) ->
    @_root = componentInfo.element
    @params = params
    extend(this, params)

class CollectionsCollapsedModel extends KnockoutComponentModel
  # These methods should be factored out eventually
  toggleVisibleCollection: (args...) => @page.collections.toggleVisibleCollection(args...)
  hasCollection: (args...) => @page.project.hasCollection(args...)
  toggleCollection: (args...) => @page.ui.projectList.toggleCollection(args...)
  accessCollection: (args...) => @page.ui.projectList.loginAndDownloadCollection(args...)
  canQueryCollectionSpatial: (args...) => @page.ui.collectionsList.canQueryCollectionSpatial(args...)
  spatialQuery: (args...) => @page.query.spatial(args...)
  toggleQueryCollectionSpatial: (args...) => @page.ui.collectionsList.toggleQueryCollectionSpatial(args...)
  # End methods to factor out

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
      parent = target
      parent = parent.parentNode until dom.hasClass(parent, 'ccol')
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
