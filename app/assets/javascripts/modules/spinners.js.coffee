do ($=jQuery) ->
  class XhrSpinner
    constructor: (@urlPattern, @selector, @button) ->
      @count = 0
    matchesRequest: (settings) ->
      settings.url.indexOf(@urlPattern) != -1
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
    new XhrSpinner('/datasets.json', '.master-overlay-main .panel-list-load-more'), # datasets list
    new XhrSpinner('/dataset_facets.json', '.master-overlay-parent .panel-list-meta'), # facets
    new XhrSpinner('/datasets/', '#dataset-details .loading'), # dataset details
    new XhrSpinner('/granules.json', '#granule-list .panel-list-load-more'), # granule list
    new XhrSpinner('/timeline.json', '.timeline-tools'), # timeline
    new XhrSpinner('/data_quality_summary.json', '#project-list .panel-list-meta'), # loading dqs
    new XhrSpinner('/accept_data_quality_summaries', '#dqs-modal .loading', '#dqs-modal .modal-button'), # accepting dqs
    new XhrSpinner('/login', '#login-modal .loading', '#login-modal .modal-button'), # login
    new XhrSpinner('/data/options', '.data-access-next'), # data access configure / retrieval
  ]

  $(document).ajaxSend (event, xhr, settings) ->
    spinner.add() for spinner in spinners when spinner.matchesRequest(settings)

  $(document).ajaxComplete (event, xhr, settings) ->
    spinner.remove() for spinner in spinners when spinner.matchesRequest(settings)
