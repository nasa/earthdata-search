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
    this.pageCount = 20;
    this.excludedGranulesList = ko.observableArray();
  }

  CwicGranules.prototype.params = function() {
    let result = CwicGranules.__super__.params.call(this);
    result.short_name = this.short_name;
    return result;
  };

  CwicGranules.prototype._toResults = function (data, current, params) {
    var entries, newItems = [];
    entries = data.feed.entry || [];
    for (var i = 0; i < entries.length; i ++) {
      newItems.push(new Granule(entries[i]));
    }
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
        delete params.page_size;
        delete params.sort_key;
        delete params.echo_collection_id;
        params.pageCount = this.pageCount;
        params.startPage = this.startPage;
        this._load(params, current, callback);
      }
    }
  };

  CwicGranules.prototype.exclude = function(granule) {
    var currentQuery, index, results;
    results = this.results();
    index = results.indexOf(granule);
    results.splice(index, 1);
    this.results(results);
    this.hits(this.hits() - 1);
    currentQuery = jQuery.param(this.params());
    this.excludedGranulesList.push({
      index: index,
      granule: granule
    });
    this.query.excludedGranules.push(granule.id);
    this._prevQuery = jQuery.param(this.params());
  };

  CwicGranules.prototype.undoExclude = function() {
    var afterValues, beforeValues, currentQuery, granule, granules, index, newGranule, newList;
    newGranule = this.excludedGranulesList.pop();
    index = newGranule.index;
    granule = newGranule.granule;
    granules = this.results();
    if (index === 0) {
      granules.unshift(granule);
      newList = granules;
    } else {
      beforeValues = granules.splice(0, index);
      afterValues = granules.splice(index - 1);
      newList = beforeValues.concat(granule, afterValues);
    }
    this.results(newList);
    this.hits(this.hits() + 1);
    currentQuery = jQuery.param(this.params());
    this.query.excludedGranules.pop();
    if (this._prevQuery === currentQuery) {
      this._prevQuery = jQuery.param(this.params());
    }
    return granule;
  };

  CwicGranules.prototype._decorateNextPage = function(params, results) {
    if (results.length > 0) {
      params.startPage = 2;
      if (results.length > 0) {
        params.pageCount = results.length;
      }
    } else {
      params.startPage = 1;
    }
  };

  CwicGranules.prototype._responseHasNextPage = function(xhr, data, results) {
    let hits = this._responseHits(xhr, data);
    if (data.feed.Query.startPage) {
      return parseInt(data.feed.Query.startPage, 10) * parseInt(data.feed.Query.count, 10) < hits;
    }
    else if (data.feed.Query.startIndex) {
      return parseInt(data.feed.Query.startIndex, 10) + parseInt(data.feed.Query.count, 10) < hits;
    }
    else {
      return false
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
    if (this.hasNextPage() && !this.isLoading()) {
      results = this.results();
      this._decorateNextPage(params, results);
      this._loadAndSet(params, results, callback);
    }
  };

  return CwicGranules;
})();


export default CwicGranules;
