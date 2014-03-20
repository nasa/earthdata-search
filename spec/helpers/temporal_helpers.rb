module Helpers
  module TemporalHelpers
    def close_datetimepicker
      page.find(".xdsoft_time.xdsoft_current").click
    end

    def js_click_temporal
      script = "$('.temporal-dropdown-button').click()"
      page.execute_script script
    end

    def js_click_apply(parent)
      script = "$('" + parent + " #temporal-submit').click()"
      page.execute_script script
    end

    def js_click_clear
      script = "$('#temporal-clear').click()"
      page.execute_script script
    end

    def js_check_recurring(prefix)
      script = "$('#" + prefix+ "-show-recurring').prop('checked', true);"
      page.execute_script script
    end

    def js_uncheck_recurring(prefix)
      script = "$('#" + prefix+ "-show-recurring').prop('checked', false);"
      page.execute_script script
    end
  end
end
