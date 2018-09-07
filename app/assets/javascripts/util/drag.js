interact(".master-overlay-main")
  .resizable({
    restrict: {
      restriction: function() {
        var toolbarOffset = $("#main-toolbar").position().top + $("#main-toolbar").outerHeight() + 15;
        return {
          x: 0,
          y: toolbarOffset,
          height: $(window).height() - toolbarOffset - $("footer").outerHeight() - 50};
        },
      endOnly: false
    },
    preserveAspectRatio: false,
    edges: { left: false, right: false, bottom: false, top: true },
  })
  .on("resizemove", function (event) {

    // Set the map tools location here so we can use the delta measurement to make sure things stay in sync
    $("#map .leaflet-top.leaflet-right").css({'bottom': ($(event.target).height() - 35 ) - event.dy + 'px'})

    // Set the height by adding the amount scrolled to the height of the container
    $(event.target).height($(event.target).height() - event.dy + 'px');

    $(".master-overlay").masterOverlay("contentHeightChanged");
  });
