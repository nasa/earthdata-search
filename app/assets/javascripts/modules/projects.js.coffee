do ($=jQuery) ->
  $(document).on 'click', '.share-project', ->
    path = $(this).parents("tr").find("a.project-url").attr("href")
    url = location.protocol + '//' + location.host + path
    input = '<input readonly="readonly" type="text" id="share-url" value=' + url + ' />'
    content = "<p>Share your project by copying the URL below and sending it to others.</p>
                <p>" + input + "</p>"

    template = "<div class='popover share-popover'>
                  <div class='arrow'></div>
                  <div class='popover-title'>Share Project</div>
                  <div class='popover-content'></div>
                  <div class='popover-navigation'>
                    <button class='button-small button-outline' data-role='end'>Close</button>
                  </div>
                </div>"

    options = {
                placement: "top"
                template: template
                html: true
                content: content
              }

    $(this).popover(options)
    $(this).popover("show")
    $('#share-url').select()

  $(document).on 'click', '.share-popover [data-role=end]', ->
    $(this).closest(".share-popover").siblings('.share-project').popover('destroy')
    $('.share-project').attr('title', 'Share Project')
