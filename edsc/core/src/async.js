var requestAnimationFrame =
      window.requestAnimationFrame || window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
      function(fn) { return window.setTimeout(fn, 0); };

var cancelAnimationFrame =
      window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.clearTimeout;

module.exports = {
  animate: requestAnimationFrame,
  cancelAnimate: cancelAnimationFrame,
  /*
   Returns a function that runs the given function on the next animation step.
   If the returned function is called twice between animation steps, the second
   call has no effect.
  */
  throttled: function(fn) {
    var running=false;
    return function() {
      if (!running) {
        running = true;
        requestAnimationFrame(function() {
          running = false;
          fn();
        });
      }
    };
  }
};
