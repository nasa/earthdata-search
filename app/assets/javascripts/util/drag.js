$(function(){
  var toolbar = $(".master-overlay-main");
  var tab = $(".master-overlay-tab");

  interact(".master-overlay-tab")
    .resizable({
      restrict: {
        restriction: function() {
          var toolbarOffset = $("#main-toolbar").position().top + $("#main-toolbar").outerHeight();
          return {
            x: 0,
            y: toolbarOffset,
            height: $(window).height() - toolbarOffset - $("footer").outerHeight() - 50
          };
        },
        endOnly: false
      },
      preserveAspectRatio: false,
      edges: { left: false, right: false, bottom: false, top: true },
    })
    .on("resizemove", function (event) {

      var newContentHeight = (toolbar.height() - event.dy);

      $(".master-overlay").masterOverlay("updateControlContainer", $('.master-overlay').height() - newContentHeight);

      toolbar.css({'height': newContentHeight + 'px'});

      $(".master-overlay").masterOverlay("contentHeightChanged");
    })

  tab.addClass('is-interactive')

})
