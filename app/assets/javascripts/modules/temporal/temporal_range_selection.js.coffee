do (document, $=jQuery, edsc_date=@edsc.util.date, temporalModel=@edsc.page.query.temporal, plugin=@edsc.util.plugin, page=@edsc.page) ->

  now = new Date()
  today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  current_year = new Date().getUTCFullYear()

  validateTemporalInputs = (root) ->
    start = root.find(".temporal-start:visible")
    end = root.find(".temporal-stop:visible")
    start_val = start.val()
    end_val = end.val()

    if start and end
      error = root.find(".tab-pane:visible .temporal-error")
      error.show()

      if start.hasClass("temporal-recurring-start")
        # Recurring start and stop must both be selected
        if start_val == "" ^ end_val == ""
          error.text("Start and End dates must both be selected")
        else if start_val > end_val
          error.text("Start must be no later than End")
        else
          error.hide()
      else
        if start_val == "" or end_val == "" or start_val <= end_val
          error.hide()
        else
          error.text("Start must be no later than End")


  setMinMaxOptions = (root, datetimepicker, $input, temporal_type) ->
    min_date = false
    max_date = false
    format = if temporal_type == "range" then 'Y-m-d' else 'm-d'

    start_val = root.find('input.temporal-' + temporal_type + '-start').val()
    stop_val = root.find('input.temporal-' + temporal_type + '-stop').val()

    if $input.hasClass('temporal-' + temporal_type + '-start') and stop_val
      max_date = stop_val.split(' ')[0]
    else if $input.hasClass('temporal-' + temporal_type + '-stop') and start_val
      min_date = start_val.split(' ')[0]

    datetimepicker.setOptions({
      minDate: min_date,
      maxDate: max_date,
      startDate: today,
      formatDate: format
    })

  updateMonthButtons = (month_label) ->
    prev_button = month_label.siblings('button.xdsoft_prev')
    next_button = month_label.siblings('button.xdsoft_next')
    prev_button.show()
    next_button.show()
    month = month_label.find('span').text()
    if month == "January"
      prev_button.hide()
    else if month == "December"
      next_button.hide()

  # parseOrdinal = (value) ->
  #   match = /(\d{4})-(\d{3})/.exec(value)
  #   return null  unless match # Date is in the wrong format
  #   year = parseInt(match[1], 10)
  #   day = parseInt(match[2], 10)
  #   date = new Date(Date.UTC(year, 0, day))
  #   return null  unless date.getUTCFullYear() is year # Date is higher than the number of days in the year
  #   edsc_date.isoUtcDateTimeString(date)

  $.fn.temporalSelectors = (options) ->
    root = this
    uiModel = options["uiModel"]
    uiModelPath = options["modelPath"]
    prefix = options["prefix"]

    # Sanity check
    console.error "Temporal selectors double initialization" if root.data('temporal-selectors')
    root.data('temporal-selectors', true)

    onChangeDateTime = (dp, $input) ->
      validateTemporalInputs(root)
      $input.trigger('change')

    # TODO set the end time to 23:59:59 if the user doesn't enter a time
    root.find('.temporal-range-picker').datepicker
      format: "yyyy-mm-dd"
      startDate: "1960-01-01"
      endDate: "#{current_year}"
      startView: 2
      todayBtn: "linked"
      clearBtn: true
      autoclose: true
      todayHighlight: true
      forceParse: false


    # root.find('.temporal-range-picker').datetimepicker
    #   format: 'Y-m-d H:i:s',
    #   allowBlank: true,
    #   closeOnDateSelect: true,
    #   lazyInit: true,
    #   className: prefix + '-datetimepicker',
    #   yearStart: '1960',
    #   yearEnd: current_year,
    #   startDate: today,
    #   onShow: (dp,$input) ->
    #     setMinMaxOptions(root, this, $input, 'range')
    #   onChangeDateTime: onChangeDateTime
    #   onGenerate: (time, input) ->
    #     time.setHours(0)
    #     time.setMinutes(0)
    #     time.setSeconds(0)
    #     picker = this
    #     if picker.find('.day-of-year-picker')?.length == 0
    #       which = if input.is('.temporal-start') then 'start' else 'stop'
    #       day_of_year_div = $("<div class='day-of-year-picker' data-bind='if: #{uiModelPath}'>
    #         <label for='day-of-year-#{which}-input'>Day of Year:</label>
    #         <input id='day-of-year-#{which}-input' data-bind='value: #{uiModelPath}.#{which}.dayOfYearString()' class='day-of-year-input' type='text' placeholder='YYYY-DDD' >
    #         <button class='button text-button day-of-year-submit' data-input='" + input.attr("id") + "'>Set</button>
    #         </div>")
    #       day_of_year_div.appendTo(picker)
    #       day_of_year_div.find('.day-of-year-submit').on 'click', ->
    #         value = $(this).prev().val()
    #         date = parseOrdinal(value)
    #         if date
    #           $("#" + $(this).attr("data-input") + ":visible").val(date).trigger('change')
    #           $(this).parents('.xdsoft_datetimepicker').hide()
    #           validateTemporalInputs(root)
    #       ko.applyBindings(page, day_of_year_div[0])

    root.find('.temporal-recurring-picker').datetimepicker
      format: 'm-d H:i:s',
      allowBlank: true,
      closeOnDateSelect: true,
      lazyInit: true,
      className: prefix + '-datetimepicker recurring-datetimepicker',
      yearStart: 2007,
      yearEnd: 2007,
      startDate: today,
      onShow: (dp,$input) ->
        updateMonthButtons($(this).find('.xdsoft_month'))
        setMinMaxOptions(root, this, $input, 'recurring')
      onChangeDateTime: onChangeDateTime
      onChangeMonth: (dp,$input) ->
        updateMonthButtons($(this).find('.xdsoft_month'))
      onGenerate: (time, input) ->
        time.setHours(0)
        time.setMinutes(0)
        time.setSeconds(0)

    root.find('.temporal-recurring-year-range').slider({
      min: 1960,
      max: current_year,
      value: [1960, current_year],
      tooltip: 'hide'
    }).on 'slide', (e) ->
      uiModel.pending.years(e.value)

    # Set the slider when the years change
    uiModel.pending.years.subscribe (years) ->
      root.find('.temporal-recurring-year-range').slider('setValue', years)

    # Initialize the slider to current value of years
    root.find('.temporal-recurring-year-range').slider('setValue', uiModel.pending.years())

    # Submit temporal range search
    updateTemporalRange = ->
      if root.find('#temporal-date-range .temporal-error').is(":hidden")
        uiModel.apply()
      else
        false

    # Submit temporal recurring search
    updateTemporalRecurring = ->
      if root.find('#temporal-recurring .temporal-error').is(":hidden")
        uiModel.apply()
      else
        false

    root.find('.temporal-submit').on 'click', ->
      visible = $(this).parent().siblings(".tab-pane:visible")
      if (visible.is(".temporal-date-range"))
        if updateTemporalRange()
          $(this).parents('.dropdown').removeClass('open')
      else if (visible.is(".temporal-recurring"))
        if updateTemporalRecurring()
          $(this).parents('.dropdown').removeClass('open')

    root.find('.temporal').on 'change paste keyup', ->
      validateTemporalInputs(root)
      event.stopPropagation()

  $(document).on 'click', '.clear-filters.button', ->
    validateTemporalInputs($('.dataset-temporal-filter'))

  $(document).on 'click', '.granule-filters-clear', ->
    validateTemporalInputs($('.granule-temporal-filter'))

  $(document).on 'click', '.temporal-filter .temporal-clear', ->
    validateTemporalInputs($(this).closest('.temporal-filter'))
    # Clear datepicker selection
    $('.temporal-range-picker').datepicker('update', '')

  # safe global stuff
  $(document).on 'click', '.xdsoft_today_button, button.xdsoft_prev, button.xdsoft_next', ->
    updateMonthButtons($(this).siblings('.xdsoft_month'))

  $(document).on 'click', 'input.day-of-year-input', ->
    # What does this even do?
    $(this).focus()


  $(document).ready ->
    $('.dataset-temporal-filter').temporalSelectors({
      uiModel: temporalModel,
      modelPath: "query.temporal.pending",
      prefix: 'dataset'
    })
