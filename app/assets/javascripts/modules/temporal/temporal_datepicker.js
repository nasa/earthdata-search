(function() {
  $.extend($.fn.datepicker.DPGlobal,{
    parseDate: function(date, format, language){
      if (!date)
        return undefined;
      if (date instanceof Date)
        return date;

      return new Date(date);
    },
    formatDate: function(date, format, language){
      if (!date)
        return '';
      return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z/, '')
    }
  });
}).call(this);
