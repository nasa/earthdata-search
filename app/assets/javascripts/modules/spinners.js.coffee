do ($=jQuery) ->
  class XhrSpinner
    constructor: (@urlPattern, @selector, @button) ->
      @count = 0
    matchesRequest: (settings) ->
      settings.url.search(@urlPattern) != -1
    add: ->
      @count++
      $(@selector).addClass('busy')
      $(@button).prop("disabled", true)
    remove: ->
      @count = Math.max(@count - 1, 0)
      if @count == 0
        $(@selector).removeClass('busy')
        $(@button).prop("disabled", false)

  spinners = [
    new XhrSpinner(/\bcollections.json\b.+\bpage_num=1\b/, '#collection-results .panel-list-meta, #collection-results .master-overlay-info.master-overlay-when-min'), # collections list first page
    new XhrSpinner(/\bcollections.json\b.+\bpage_num=([2-9]\d*|\d{2,})\b/, '.master-overlay-main .panel-list-load-more'), # collections list scrolling
    new XhrSpinner('/collection_facets.json', '.master-overlay-parent .panel-list-meta'), # facets
    new XhrSpinner('/collections/', '#collection-details .loading'), # collection details
    new XhrSpinner('/granules/', '#granule-details .loading'), # granule details
    new XhrSpinner('/granules.json', '#granule-list .panel-list-load-more'), # granule list
    new XhrSpinner('/timeline.json', '.timeline-tools'), # timeline
    new XhrSpinner('/data/options', '.data-access-next'), # data access retrieval
    new XhrSpinner('/update_notification_pref', '.access-submit') # updating contact info before submitting an access request
  ]

  $(document).ajaxSend (event, xhr, settings) ->
    spinner.add() for spinner in spinners when spinner.matchesRequest(settings)

  $(document).ajaxComplete (event, xhr, settings) ->
    spinner.remove() for spinner in spinners when spinner.matchesRequest(settings)
