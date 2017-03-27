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
  .on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    target.style.top = 100 - (((event.rect.height / $(window).height())) * 100) + '%';
    target.style.height = (((event.rect.height / $(window).height())) * 100) + '%';
    $('#collection-scroll-pane').height(event.rect.height);

  });
