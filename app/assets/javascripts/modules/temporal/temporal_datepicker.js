(function() {
  $.extend($.fn.datepicker.DPGlobal,{
    formatDate: function(date, format, language){
      if (!date)
        return '';

      if (format == "yyyy-mm-dd")
        return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z/, '');
      else
        return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z/, '').substring(5);
    }
  });
}).call(this);
