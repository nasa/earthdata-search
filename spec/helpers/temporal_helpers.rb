module Helpers
  module TemporalHelpers
    def set_temporal(start, stop=nil, range=nil, dataset_n=nil)
      start = start.strftime('%Y-%m-%d %H:%M:%S') if start && start.is_a?(DateTime)
      stop = stop.strftime('%Y-%m-%d %H:%M:%S') if stop && stop.is_a?(DateTime)

      script = "(function(temporal) {\n"

      script += "  temporal.isRecurring(#{!range.nil?});\n"
      unless range.nil?
        start = start.gsub(/^\d{4}-/, '')
        stop = stop.gsub(/^\d{4}-/, '')
        script += "  temporal.start.year('#{range[0]}');\n"
        script += "  temporal.stop.year('#{range[1]}');\n"
      end
      script += "  temporal.start.humanDateString('#{start}');\n" unless start.nil?
      script += "  temporal.stop.humanDateString('#{stop}');\n" unless stop.nil?

      if dataset_n.nil?
        script += "})(edsc.page.query.temporal());"
      else
        script += "})(edsc.page.project.datasets()[#{dataset_n}].granulesModel.temporal.applied);"
      end
      page.evaluate_script(script)
      wait_for_xhr
    end

    def unset_temporal(dataset_n=nil)
      script = "(function(temporal) {\n"
      script += "  temporal.clear();\n"
      if dataset_n.nil?
        script += "})(edsc.page.query.temporal());"
      else
        script += "})(edsc.page.project.datasets()[#{dataset_n}].granulesModel.temporal.applied);"
      end
      page.evaluate_script(script)
      wait_for_xhr
    end

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
      script = "$('#" + prefix+ "-show-recurring').click()"
      page.execute_script script
    end

    def js_uncheck_recurring(prefix)
      script = "if ($('#" + prefix+ "-show-recurring').is(':checked')) {$('#" + prefix+ "-show-recurring').click()}"
      page.execute_script script
    end
  end
end
