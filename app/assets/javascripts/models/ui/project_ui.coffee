ns = @edsc.models.ui

ns.ProjectUI = do (ko
                    window
                    document
                    urlUtil=@edsc.util.url
                    xhrUtil=@edsc.util.xhr
                    dateUtil=@edsc.util.date
                    deparam = @edsc.util.deparam
                    $ = jQuery
                    wait=@edsc.util.xhr.wait
                    ajax = @edsc.util.xhr.ajax) ->

  class ProjectUI
    constructor: (@project) ->
 
    showType: =>
      type = ""
      if urlUtil.currentParams().bounding_box then type = "Rectangle"
      if urlUtil.currentParams().polygon then type = "Polygon"
      if urlUtil.currentParams().point then type = "Point"
      type

    hasType: =>
      urlUtil.currentParams().bounding_box || urlUtil.currentParams().polygon || urlUtil.currentParams().point
    
    showTemporal: =>
      if urlUtil.currentParams().temporal
        m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
        label = "" 
        dates = urlUtil.currentParams().temporal.split(",")
        date1 = dates[0].split("T")[0].split("-")
        formattedDate = new Date(date1[0] + "-" + date1[1].replace(/^0+/, '') + "-" + date1[2].replace(/^0+/, ''))
        d1 = formattedDate.getDate()
        m1 = formattedDate.getMonth()
        y1 = formattedDate.getFullYear();
        date2 = dates[1].split("T")[0].split("-")
        formattedDate = new Date(date2[0] + "-" + date2[1].replace(/^0+/, '') + "-" + date2[2].replace(/^0+/, ''))
        d2 = formattedDate.getDate()
        m2 = formattedDate.getMonth()
        y2 = formattedDate.getFullYear();
        if y1==y2
          if m1==m2
            label = m_names[m1] + " " + d1 + " - " + d2 + ", " + y1
          else
            label = m_names[m1] + " " + d1 + " - " + m_names[m2] + " " + d2 + ", " + y1
        else
          label = if m1 then m_names[m1] + " " + d1 + ", " + y1 else "Beginning of time "
          label += if m2 then " - " + m_names[m2] + " " + d2 + ", " + y2 else " - End of Time"
        label
      else
        false

  exports = ProjectUI
