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
    this.startPage = 1;
    this.pageCount = 10;
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
    if (params.startPage > 1) {
      return current.concat(newItems);
    } else {
      return newItems;
    }
  };

  CwicGranules.prototype._computeSearchResponse = function(current, callback, needsLoad) {
    var params, query, results, _ref;
    if (needsLoad == null) {
      needsLoad = true;
    }
    if ((_ref = this.query) != null ? _ref.isValid() : void 0) {
      results = [];
      params = this.params();
      delete params.page_size;
      params.pageCount = this.pageCount;
      params.startPage = this.startPage;
      query = jQuery.param(params);
      if (needsLoad && this._prevQuery !== query) {
        this.excludedGranulesList([]);
        this._prevQuery = query;
        if (params.temporal === 'no-data') {
          this.results([]);
          this.hits(0);
          return;
        }
        if (this._resultsComputed) {
          this.results([]);
        }
        this._resultsComputed = true;
        this.isLoaded(false);
        return this._load(params, current, callback);
      }
    }
  };

  CwicGranules.prototype.loadNextPage = function(params, callback) {
    var results;
    if (params == null) {
      params = this.params();
    }
    if (callback == null) {
      callback = null;
    }

    params.startPage = this.startPage + 1;
    params.pageCount = this.pageCount;
    if (this.hasNextPage() && !this.isLoading()) {
      results = this.results();
      return this._loadAndSet(params, results, callback);
    }
  };

  return CwicGranules;
})();


export default CwicGranules;
