do (document, $=jQuery, edsc_date=@edsc.util.date, temporalModel=@edsc.page.ui.temporal) ->

  $.fn.temporalSelectors = (options) ->
    root = this;
    uiModel = options["uiModel"]
    uiModelPath = options["modelPath"]
    current_year = new Date().getUTCFullYear()

    validateTemporalInputs = ->
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


    setMinMaxOptions = (datetimepicker, $input, temporal_type) ->
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
        formatDate: format
      })

    updateMonthButtons = (month_label) ->
      prev_button = root.find(month_label).siblings('button.xdsoft_prev')
      next_button = root.find(month_label).siblings('button.xdsoft_next')
      prev_button.show()
      next_button.show()
      month = month_label.find('span').text()
      if month == "January"
        prev_button.hide()
      else if month == "December"
        next_button.hide()

    addDayOfYear = (picker, input) ->
      if picker.find('.day-of-year-picker')?.length == 0
        which = if input.is('.temporal-start') then 'start' else 'stop'
        day_of_year_div = $("<div class='day-of-year-picker'>
          <label for='day-of-year-#{which}-input'>Day of Year:</label>
          <input id='day-of-year-#{which}-input' data-bind='value: #{uiModelPath}.#{which}.dayOfYearString' class='day-of-year-input' type='text' placeholder='YYYY-DDD' >
          <button id='day-of-year-submit' class='button text-button' data-input='" + input.attr("id") + "'>Set</button>
          </div>")
        day_of_year_div.appendTo(picker)
        ko.applyBindings(@edsc.page, day_of_year_div[0])

    parseOrdinal = (value) ->
      match = /(\d{4})-(\d{3})/.exec(value)
      return null  unless match # Date is in the wrong format
      year = parseInt(match[1], 10)
      day = parseInt(match[2], 10)
      date = new Date(Date.UTC(year, 0, day))
      return null  unless date.getUTCFullYear() is year # Date is higher than the number of days in the year
      edsc_date.isoUtcDateTimeString(date)

    $(document).on 'click', '#day-of-year-submit', ->
      value = $(this).prev().val()
      date = parseOrdinal(value)
      if date
        $("#" + $(this).attr("data-input") + ":visible").val(date).trigger('change')
        $(this).parents('.xdsoft_datetimepicker').hide()
        validateTemporalInputs()

    root.find('.temporal-range-picker').datetimepicker({
      format: 'Y-m-d H:i:s',
      yearStart: '1960',
      yearEnd: current_year,
      onShow: (dp,$input) ->
        setMinMaxOptions(this, $input, 'range')
      onChangeDateTime: (dp,$input) ->
        # Default minutes and seconds to 00
        datetime = $input.val().split(":")
        datetime[1] = "00"
        datetime[2] = "00"
        $input.val(datetime.join(":"))

        validateTemporalInputs()

        $input.trigger('change')
      onGenerate: (dp,$input) ->
        addDayOfYear(this, $input)
    })

    root.find('.temporal-recurring-picker').datetimepicker({
      format: 'm-d H:i:s',
      className: 'recurring-datetimepicker',
      yearStart: 2007,
      yearEnd: 2007,
      onShow: (dp,$input) ->
        updateMonthButtons($(this).find('.xdsoft_month'))
        setMinMaxOptions(this, $input, 'recurring')
      onChangeDateTime: (dp,$input) ->
        # Default minutes and seconds to 00
        datetime = $input.val().split(":")
        datetime[1] = "00"
        datetime[2] = "00"
        $input.val(datetime.join(":"))

        validateTemporalInputs()

        $input.trigger('change')
      onChangeMonth: (dp,$input) ->
        updateMonthButtons($(this).find('.xdsoft_month'))
    })

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

    root.find('#temporal-submit').on 'click', ->
      visible = $(this).parent().siblings(".tab-pane:visible")
      if (visible.is("#temporal-date-range"))
        if updateTemporalRange()
          $(this).parents('.dropdown').removeClass('open')
      else if (visible.is("#temporal-recurring"))
        if updateTemporalRecurring()
          $(this).parents('.dropdown').removeClass('open')

    $(document).on 'click', '.clear-filters.button, .temporal-clear', ->
      validateTemporalInputs()

    $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker .xdsoft_today_button', ->
      updateMonthButtons($(this).siblings('.xdsoft_month'))

    $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker button.xdsoft_prev', ->
      updateMonthButtons($(this).siblings('.xdsoft_month'))

    $(document).on 'click', '.recurring-datetimepicker .xdsoft_mounthpicker button.xdsoft_next', ->
      updateMonthButtons($(this).siblings('.xdsoft_month'))

    $(document).on 'click', 'input.day-of-year-input', ->
      $(this).focus()

    root.find('.temporal').on 'change paste keyup', ->
      validateTemporalInputs()
      event.stopPropagation()


  $(document).ready ->
    $('.dataset-temporal-filter').temporalSelectors({
      uiModel: temporalModel,
      modelPath: "ui.temporal.pending"
    })
