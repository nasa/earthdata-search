import extend from './extend.jsx';

let CwicGranule = (function() {
  extend(CwicGranule, window.edsc.models.data.Granule);

  function CwicGranule(jsonData) {
    CwicGranule.__super__.constructor.apply(this, Array.prototype.slice.call(arguments));
  }

  CwicGranule.prototype.edsc_browse_url = function(w, h) {
    console.log(this);
    // arguments w, h are not currently used.
    for (var i = 0; i < this.links.length; i ++) {
      if (this.links[i].title == 'Browser') {
        return this.links[i].href;
      }
    }
    return null;
  };

  return CwicGranule;
})();


export default CwicGranule;
