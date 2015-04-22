(function(dateUtil) {
  $.extend($.fn.datepicker.DPGlobal,{
    formatDate: function(date, format, language){
      if (!date)
        return '';

      if (format == "yyyy-mm-dd")
        return dateUtil.toISOString(date).replace('T', ' ').replace(/\.\d{3}Z/, '');
      else
        return dateUtil.toISOString(date).replace('T', ' ').replace(/\.\d{3}Z/, '').substring(5);
    }
  });
})(this.edsc.util.date);
