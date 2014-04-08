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
    end

  end
end
