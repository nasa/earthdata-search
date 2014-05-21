class XhrSpinner
  constructor: (@selector, @urlPattern, @button) ->
    @count = 0
  matchesRequest: (settings) ->
    settings.url.indexOf(@urlPattern) != -1
  add: ->
    @count++
    $(@selector).addClass('busy')
    $(@button).prop("disabled",true)
  remove: ->
    @count = Math.max(@count - 1, 0)
    if @count == 0
      $(@selector).removeClass('busy')
      $(@button).prop("disabled",false)

spinners = [
  new XhrSpinner('.master-overlay-main .panel-list-load-more', 'datasets.json', null), # datasets list
  new XhrSpinner('.panel-list-meta', 'dataset_facets.json', null), # facets
  new XhrSpinner('#dataset-details .loading', '/datasets/', null), # dataset details
  new XhrSpinner('.panel-list-load-more', 'granules.json', null), # granule list
  new XhrSpinner('.timeline-tools', 'timeline.json', null), # timeline
  new XhrSpinner('.panel-list-meta', 'data_quality_summary.json', null), # loading dqs
  new XhrSpinner('#dqs-modal .loading', 'accept_data_quality_summaries', '#dqs-modal .modal-button'), # accepting dqs
  new XhrSpinner('#login-modal .loading', 'login', '#login-modal .modal-button'), # login
  new XhrSpinner('.data-access .loading', 'data/options', null), # data access configure
  new XhrSpinner('.data-access-content', 'data/options', null), # data access retrieval
]

$(document).ajaxSend (event, xhr, settings) ->
  spinner.add() for spinner in spinners when spinner.matchesRequest(settings)

$(document).ajaxComplete (event, xhr, settings) ->
  spinner.remove() for spinner in spinners when spinner.matchesRequest(settings)
