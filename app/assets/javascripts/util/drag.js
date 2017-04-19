interact(".master-overlay-main")
  .resizable({
    restrict: {
      restriction: function() {
        var toolbarOffset = $("#main-toolbar").position().top + $("#main-toolbar").outerHeight();
        return {x: 0, y: toolbarOffset, height: $(window).height() - toolbarOffset - $("footer").outerHeight() - 50};
        },
      endOnly: false
    },
    preserveAspectRatio: false,
    edges: { left: false, right: false, bottom: false, top: true },
  })
  .on("resizemove", function (event) {
    var target = event.target;
    target.style.top = 100 - (((event.rect.height / $(window).height())) * 100) + '%';
    target.style.height = (((event.rect.height / $(window).height())) * 100) + '%';

    $(".master-overlay").masterOverlay("contentHeightChanged");
  });
