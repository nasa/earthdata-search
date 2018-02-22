$(document).ready(function(){
    $("p.collection-filters").hide();
    // Not using JQuery check functionality for this part because it interferes with knockout.
    if ($("input#hasNonEOSDIS").is(':checked') == false) {
        $("input#hasNonEOSDIS").trigger('click')
    }
    if ($("input#has-granules").is(':checked') == true) {
        $("input#has-granules").trigger('click')
    }
});


