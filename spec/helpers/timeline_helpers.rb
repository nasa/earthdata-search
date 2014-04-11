module Helpers
  module TimelineHelpers

    def pan_timeline(dt)
      dt_ms = dt.to_i * 1000

      page.evaluate_script """
        (function() {
          var $timeline = $('#timeline');
          var dx = -$timeline.timeline('timeSpanToPx', #{dt_ms});
          var $svg = $timeline.find('svg');
          $svg.simulate('drag', { dx: dx, dy: 0 });
        })();
      """
      wait_for_xhr
    end

    def click_timeline_date(text, subtext=nil)
      if subtext.nil?
        page.find('.timeline-date-label text', text: text).click
      else
        page.find('.timeline-date-label', text: text + subtext).find('text', text: text).click
      end
      wait_for_xhr
    end

  end
end
