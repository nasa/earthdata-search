module Helpers
  module TimelineHelpers

    def pan_timeline(dt)
      drag_element_by_time('svg', dt)
    end

    def pan_to_time(time)
      page.execute_script("$('#timeline').timeline('panToTime', #{time.to_i * 1000})")
    end

    def click_timeline_zoom_in
      find('.timeline-zoom-in').click
      wait_for_xhr
    end

    def click_timeline_zoom_out
      find('.timeline-zoom-out').click
      wait_for_xhr
    end

    def click_timeline_date(text, subtext=nil)
      if subtext.nil?
        page.find('.timeline-date-label text', text: text).click
      else
        # Click the second timeline element with matching text
        page.all('.timeline-date-label text', text: text)[1].click
      end
      wait_for_xhr
    end

    def drag_temporal(old_date, new_date)
      dt = old_date.to_i - new_date.to_i

      old_time = old_date.to_i * 1000
      position = page.evaluate_script "$('#timeline').timeline('timeToPosition', #{old_time})"

      selector = ".timeline-selection line[x1^=\"#{position.to_s[0, 4]}\"] + path"

      unless page.all(selector).size > 0
        selector = '.timeline-display-top'
      end

      drag_element_by_time(selector, dt, old_date)

      wait_for_xhr
    end

    private

    def drag_element_by_time(selector, dt, start_t=nil)
      dt_ms = dt.to_i * 1000

      x_opts = nil
      unless start_t.nil?
        start_t_ms = start_t.to_i * 1000
        x = page.evaluate_script "$('#timeline').timeline('timeToPosition', #{start_t_ms})"
        transform = page.evaluate_script("$('#timeline').find('.timeline-draggable').attr('transform')")
        x += transform.gsub('translate(', '').to_f
        x_opts = ", x0: #{x}"
      end

      script = """
        (function() {
          var $timeline = $('#timeline');
          var dx = -$timeline.timeline('timeSpanToPx', #{dt_ms});
          var $svg = $timeline.find('#{selector}');
          $svg.simulate('drag', { dx: dx, dy: 0#{x_opts}});
        })();
      """
      page.execute_script script
      wait_for_xhr
    end
  end
end
