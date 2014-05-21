do ($ = jQuery) ->
  $(document).ready ->
    facets = '.panel-list-meta'
    datasets = '.master-overlay-main .panel-list-load-more'
    datasets_retrieve = '.data-access-datasets-list'
    dataset = '#dataset-details .loading'
    granules = '.panel-list-load-more'
    timeline = '.timeline-tools'
    dqs_load = '.panel-list-meta'
    dqs_accept = '#dqs-modal .loading'
    dqs_button = '#dqs-modal .button-light'
    login = '#login-modal .loading'
    login_button = '#login-modal .button-light'
    configure = '.data-access .loading'

    # Show spinner at start of ajax request
    $(document).ajaxSend (event, jqxhr, settings) ->
      url = settings.url
      # alert url

      $(facets).addClass('busy') if url.indexOf('dataset_facets.json') > -1
      if url.indexOf('datasets.json') > -1
        $(datasets).addClass('busy')
        $(datasets_retrieve).addClass('busy')
      $(dataset).addClass('busy') if url.indexOf('/datasets/') > -1
      $(granules).addClass('busy') if url.indexOf('granules.json') > -1
      $(timeline).addClass('busy') if url.indexOf('timeline.json') > -1
      $(dqs_load).addClass('busy') if url.indexOf('data_quality_summary.json') > -1
      if url.indexOf('accept_data_quality_summaries') > -1
        $(dqs_accept).addClass('busy')
        $(dqs_button).prop("disabled",true)
      if url.indexOf('login') > -1
        $(login).addClass('busy')
        $(login_button).prop("disabled",true)
      $(configure).addClass('busy') if url.indexOf('data/options') > -1

      null

    # Hide spinner when ajax request finishes
    $(document).ajaxComplete (event, jqxhr, settings) ->
      url = settings.url
      # alert 'Stopped ' + url

      $(facets).removeClass('busy') if url.indexOf('dataset_facets.json') > -1
      if url.indexOf('datasets.json') > -1
        $(datasets).removeClass('busy')
        $(datasets_retrieve).removeClass('busy')
      $(dataset).removeClass('busy') if url.indexOf('/datasets/') > -1
      $(granules).removeClass('busy') if url.indexOf('granules.json') > -1
      $(timeline).removeClass('busy') if url.indexOf('timeline.json') > -1
      $(dqs_load).removeClass('busy') if url.indexOf('data_quality_summary.json') > -1
      if url.indexOf('accept_data_quality_summaries') > -1
        $(dqs_accept).removeClass('busy')
        $(dqs_button).prop("disabled",false)
      if url.indexOf('login') > -1
        $(login).removeClass('busy')
        $(login_button).prop("disabled",false)
      $(configure).removeClass('busy') if url.indexOf('data/options') > -1

      null
