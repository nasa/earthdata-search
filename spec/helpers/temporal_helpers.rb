module Helpers
  module TemporalHelpers
    def manually_set_temporal(start, stop = nil, range = [])
      page.find('.temporal-dropdown-button').click

      if range.empty?
        page.find(:css, "#collection-show-recurring").set(false)

        if start #&& start.is_a?(DateTime)
          # start = start.strftime('%Y-%m-%d %H:%M:%S')
          fill_in('collection-temporal-range-start', with: start)
        end

        if stop #&& stop.is_a?(DateTime)
          # stop = stop.strftime('%Y-%m-%d %H:%M:%S')
          fill_in('collection-temporal-range-stop', with: stop)
        end
      else
        page.find(:css, "#collection-show-recurring").set(true)

        fill_in('collection-temporal-recurring-start', with: start)

        loop do
          page.find(".slider-handle", match: :first).drag_by(5, 0)
          break if find('.temporal-recurring-year-range-value').text.split('-').first.strip == range[0].to_s
        end

        if range.size == 2
          fill_in('collection-temporal-recurring-stop', with: stop)

          loop do
            page.all(".slider-handle").last.drag_by(-5, 0)
            break if find('.temporal-recurring-year-range-value').text.split('-').last.strip == range[1].to_s
          end
        end

        find('.temporal-dropdown').click
      end

      page.find('#temporal-submit').click
      wait_for_xhr
    end

    def manually_unset_temporal
      if page.has_link?('Remove temporal constraint')
        page.find('a[title="Remove temporal constraint"]').click
        wait_for_xhr
      end
    end

    def set_temporal(start, stop=nil, range=nil, collection_n=nil)
      wait_for_xhr
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

      if collection_n.nil?
        script += "})(edsc.page.query.temporal.applied);"
      elsif collection_n == :focus
        script += "})(edsc.page.project.focus().collection.granuleDatasource().temporal());"
      else
        script += "})(edsc.page.project.collections()[#{collection_n}].granuleDatasource().temporal());"
      end
      page.execute_script(script)
      wait_for_xhr
    end

    def unset_temporal(collection_n=nil)
      wait_for_xhr
      script = "(function(temporal) {\n"
      script += "  temporal.clear();\n"
      if collection_n.nil?
        script += "})(edsc.page.query.temporal.applied);"
      elsif collection_n == :focus
        script += "})(edsc.page.project.focus().collection.granuleDatasource().temporal());"
      else
        script += "})(edsc.page.project.collections()[#{collection_n}].granuleDatasource().temporal());"
      end
      page.execute_script(script)
      wait_for_xhr
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
      wait_for_xhr
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
