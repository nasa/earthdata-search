module Helpers
  module TimelineHelpers

    def pan_timeline(dt)
      dt_ms = dt.to_i * 1000
      timeline = "$('#timeline').timeline"

      page.evaluate_script """
        (function() {
          var $timeline = $('#timeline ');
          var dx = -$timeline.timeline('timeSpanToPx', #{dt_ms});
          $timeline.find('.timeline-background').simulate('drag', { dx: dx, dy: 0 });
        })();
      """
    end

  end
end
