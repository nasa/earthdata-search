do (document, $=jQuery, edsc_date=@edsc.util.date, temporalModel=@edsc.page.query.temporal, plugin=@edsc.util.plugin, page=@edsc.page) ->

  now = new Date()
  today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  current_year = new Date().getUTCFullYear()

  validateTemporalInputs = (root) ->
    start = root.find(".temporal-start:visible")
    end = root.find(".temporal-stop:visible")
    startVal = start.val()
    endVal = end.val()
    startDate = edsc_date.parseIsoUtcString(startVal)
    endDate = edsc_date.parseIsoUtcString(endVal)

    error = root.find(".tab-pane:visible .temporal-error")
    error.hide()

    if startDate?.toString() == 'Invalid Date' or endDate?.toString() == 'Invalid Date'
      error.show()
      error.text("Invalid date")
    else
      error.hide()

    if !error.is(':visible') and start and end
      error.show()

      if start.hasClass("temporal-recurring-start")
        # Recurring start and stop must both be selected
        if startVal == "" ^ endVal == ""
          error.text("Start and End dates must both be selected")
        else if startVal > endVal
          error.text("Start must be no later than End")
        else
          error.hide()
      else
        if startVal == "" or endVal == "" or startVal <= endVal
          error.hide()
        else
          error.text("Start must be no later than End")

  originalSetDate = null

  $.fn.temporalSelectors = (options) ->
    root = this
    uiModel = options["uiModel"]
    uiModelPath = options["modelPath"]
    prefix = options["prefix"]

    # Sanity check
    console.error "Temporal selectors double initialization" if root.data('temporal-selectors')
    root.data('temporal-selectors', true)

    onChangeDateTime = (dp, $input) ->
      $input.trigger('change')

    root.find('.temporal-range-picker').datepicker
      format: "yyyy-mm-dd"
      startDate: "1960-01-01"
      endDate: new Date()
      startView: 2
      todayBtn: "linked"
      clearBtn: true
      autoclose: true
      todayHighlight: true
      forceParse: false
      keyboardNavigation: false

    root.find('.temporal-recurring-picker').datepicker
      format: "mm-dd"
      startDate: "1960-01-01"
      endDate: "1960-12-31"
      startView: 1
      todayBtn: "linked"
      clearBtn: true
      autoclose: true
      todayHighlight: true
      forceParse: false
      keyboardNavigation: false

    # Set end time to 23:59:59
    DatePickerProto = Object.getPrototypeOf($('.temporal').data('datepicker'))
    unless originalSetDate?
      originalSetDate = DatePickerProto._setDate
      DatePickerProto._setDate = (date, which) ->
        updatedDate = date
        if $(this.element).hasClass('temporal-range-stop')
          updatedDate.setSeconds(date.getSeconds() + 86399) # 23:59:59
        originalSetDate.call(this, updatedDate, which)

    # TODO hide year selection from recurring pickers

    # root.find('.temporal-recurring-picker').datetimepicker
    #   format: 'm-d H:i:s',
    #   allowBlank: true,
    #   closeOnDateSelect: true,
    #   lazyInit: true,
    #   className: prefix + '-datetimepicker recurring-datetimepicker',
    #   yearStart: 2007,
    #   yearEnd: 2007,
    #   startDate: today,
    #   onShow: (dp,$input) ->
    #     updateMonthButtons($(this).find('.xdsoft_month'))
    #     setMinMaxOptions(root, this, $input, 'recurring')
    #   onChangeDateTime: onChangeDateTime
    #   onChangeMonth: (dp,$input) ->
    #     updateMonthButtons($(this).find('.xdsoft_month'))
    #   onGenerate: (time, input) ->
    #     time.setHours(0)
    #     time.setMinutes(0)
    #     time.setSeconds(0)
    #     if input.hasClass('temporal-recurring-stop')
    #       time.setHours(23)
    #       time.setMinutes(59)
    #       time.setSeconds(59)

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

    root.find('.temporal').on 'paste keyup change focusout', (e) ->
      validateTemporalInputs(root)
      e.stopPropagation()

  $(document).on 'click', '.clear-filters.button', ->
    validateTemporalInputs($('.dataset-temporal-filter'))

  $(document).on 'click', '.granule-filters-clear', ->
    validateTemporalInputs($('.granule-temporal-filter'))

  $(document).on 'click', '.temporal-filter .temporal-clear', ->
    validateTemporalInputs($(this).closest('.temporal-filter'))
    # Clear datepicker selection
    $('.temporal-range-start').datepicker('update')
    $('.temporal-range-stop').datepicker('update')

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
