import extend from './extend.jsx';
import Granule from './Granule.jsx';

let bind = function(fn, self){
  return function(){
    return fn.apply(self, arguments);
  };
};

let CwicGranules = (function() {
  extend(CwicGranules, window.edsc.models.data.Granules);

  function CwicGranules(query, parentQuery, short_name) {
    this.params = bind(this.params, this);
    this.short_name = short_name;
    CwicGranules.__super__.constructor.apply(this, Array.prototype.slice.call(arguments));
    this.path = '/granules/cwic.json';
  }

  CwicGranules.prototype.params = function() {
    let result = CwicGranules.__super__.params.call(this);
    result.short_name = this.short_name;
    return result;
  };

  CwicGranules.prototype._toResults = function (data, current, params) {
    var entries, entry, newItems;
    entries = data.feed.entry;
    newItems = (function () {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = entries.length; _i < _len; _i++) {
        entry = entries[_i];
        _results.push(new Granule(entry));
      }
      return _results;
    })();
    if (params.page_num > 1) {
      return current.concat(newItems);
    } else {
      return newItems;
    }
  };

  return CwicGranules;
})();


export default CwicGranules;
