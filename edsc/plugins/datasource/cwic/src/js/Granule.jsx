import extend from './extend.jsx';

let CwicGranule = (function() {
  extend(CwicGranule, window.edsc.models.data.Granule);

  function CwicGranule(jsonData) {
    CwicGranule.__super__.constructor.apply(this, Array.prototype.slice.call(arguments));
  }

  CwicGranule.prototype.edsc_browse_url = function(w, h) {
    // arguments w, h are not currently used.
    for (var i = 0; i < this.links.length; i ++) {
      if (this.links[i].title == 'Browser') {
        return this.links[i].href;
      }
    }
    return null;
  };

  CwicGranule.prototype.getTemporal = function () {
    if (typeof this.date !== "undefined" && this.date !== null) {
      var temporal = this.date.split("/");
      var time_start, time_end;
      time_start = temporal[0];
      time_end = temporal[1];

      if (time_start === time_end) {
        return time_start;
      }
      if (time_end == null) {
        return time_start;
      }
      if (time_start == null) {
        return time_end;
      }
      return "" + time_start + " to " + time_end;
    }
    return null;
  };

  return CwicGranule;
})();


export default CwicGranule;
