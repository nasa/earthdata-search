interact('.master-overlay-main')
  .resizable({
    restrict: {
      restriction: {
        x: 0,
        y: 250,
        width: 0,
        height: 825
      }
    },
    preserveAspectRatio: false,
    edges: { left: false, right: false, bottom: false, top: true },
  })
  .on("resizemove", function (event) {
    var target = event.target;
    windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    target.style.top = (windowHeight - $(".main-content").position().top - event.rect.height) + "px";
    target.style.height = (event.rect.height - $("body > footer").outerHeight()) + "px";

    $(".master-overlay").masterOverlay("contentHeightChanged");
  });
