import extend from './extend.jsx';
import Granule from './Granule.jsx';
import * as XmlHelpers from './XmlHelpers.jsx';
import * as CwicUtils from './CwicUtils.jsx';

let ajax = window.edsc.util.xhr.ajax;
let clientId = window.edsc.config.cmrClientId;
let murmurhash3 = window.edsc.util.murmurhash3;

let xmlNamespaces = {
  os: 'http://a9.com/-/spec/opensearch/1.1/'
};

let bind = function(fn, self){
  return function(){
    return fn.apply(self, arguments);
  };
};

let toLocalUrl = function(url) {
  if (url) {
    url = url.replace(/^.*\/\/[^\/]+/, '/cwic');
  }
  return url;
};

let getLink = function(parent, rel) {
  let node = parent.firstChild;
  while (node) {
    if (node.nodeType == Node.ELEMENT_NODE && node.tagName == 'link' && node.getAttribute('rel') == rel) {
      return node.getAttribute('href');
    }
    node = node.nextSibling;
  }
  return null;
};

let getRootLink = function(atomData, rel) {
  return getLink(atomData.firstChild, rel);
};

let CwicGranules = (function() {
  extend(CwicGranules, window.edsc.models.data.Granules);

  function CwicGranules(query, parentQuery, datasetId) {
    this.params = bind(this.params, this);
    CwicGranules.__super__.constructor.apply(this, Array.prototype.slice.call(arguments));
    this.method = 'get';
    this.osddPath = `/cwic/opensearch/datasets/${datasetId}/osdd.xml?clientId=${clientId}`;
    this.osdd = ko.observable(null);
  }

  CwicGranules.prototype._edscParamsToOpenSearch = function (params) {
    let result = {};

    for (let key in params) {
      let value = params[key];
      if (params.hasOwnProperty(key) && value != null) {
        if (key == 'temporal') {
          let temporal = value.split(',');
          let start = temporal[0], end = temporal[1];

          if (start && start.length > 0) result['time:start'] = start.replace(/\.\d{3}Z$/, 'Z');
          if (end && end.length > 0) result['time:end'] = end.replace(/\.\d{3}Z$/, 'Z');
        }
        else if (key == 'bounding_box' || key == 'mbr') {
          result['geo:box'] = value;
        }
        else if (key == 'point') {
          let p = value.split(',');
          let lon = parseFloat(p[0]);
          let lat = parseFloat(p[1]);
          let epsilon = 0.001;
          result['geo:box'] = `${lon-epsilon},${lat-epsilon},${lon+epsilon},${lat+epsilon}`;
        }
        else {
          result[key] = value;
        }
      }
    }
    if (!result.hasOwnProperty('count')) result.count = 20;
    return result;
  };

  CwicGranules.prototype._urlFor = function (params) {
    let url;
    if (typeof(params) == 'string') {
      // Allow passing a URL directly
      url = params;
    }
    else {
      if (!this.osdd()) {
        return null;
      }
      url  = this.osdd().url;
      params = this._edscParamsToOpenSearch(params);
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          let matcher = new RegExp("{" + key + "\\??}");
          let value = encodeURIComponent(params[key]);
          url = url.replace(matcher, value);
        }
      }
    }

    // Completely remove remaining parameters
    url = url.replace(/[?&][^=]*=\{[^\}]*\}/g, "");
    return url;
  };

  CwicGranules.prototype._spliceGranulesResult = function(results) {
    // TODO: an O(n^2) search and remove. Can be optimized to O(nlogn) by sorting the excludedGranules() array.
    let excludedIds = this.query.excludedGranules();
    for (let i = 0; i < excludedIds.length; i ++) {
      for (let j = 0; j < results.length; j ++) {
        let hashedId = murmurhash3(results[j].id);
        if (hashedId == excludedIds[i]) {
          results.splice(j, 1);
          j --;
        }
      }
    }
  };

  CwicGranules.prototype._load = function (params, current, callback) {
    if (!this.osdd()) {
      this._loadOsdd(() => this._load(params, current, callback));
      return;
    }
    let url = this._urlFor(params);

    this.abort();
    this.isLoading(true);
    this.isError(false);

    let requestId = this.completedRequestId + 1;
    console.log(`Request (${requestId}): ${url}`);
    let start = new Date();

    let xhrOpts = {
      method: 'get',
      dataType: 'xml',
      url: url,
      retry: () => this._load(params, current, callback),
      success: (data, status, xhr) => {
        let dataObj, results;
        this.stale = false;
        this.isLoaded(true);
        console.log(`Complete (${requestId}): ${url}`);
        dataObj = XmlHelpers.elToObj(data);
        results = this._toResults(data, dataObj, current, params);
        let beforeSplice = results.length;
        this._spliceGranulesResult(results);
        this.hits(dataObj.feed.totalResults - this.query.excludedGranules().length);
        this.nextPageUrl = toLocalUrl(getRootLink(data, 'next'));
        this.hasNextPage(this.nextPageUrl != null);
        let timing = ((new Date() - start) / 1000).toFixed(1);
        this.loadTime(timing);
        if (callback) callback(results);
        if (beforeSplice != 0 && results.length == 0) this._loadAndSet(this.nextPageUrl, this.results());
      },
      complete: () => {
        this.completedRequestId = requestId;
        this.currentRequest = null;
        this.isLoading(false);
      },
      error: (response, type, reason) => {
        this.isError(true);
        console.log(`Fail (${requestId}) [${reason}]: ${url}`);
      }
    };

    this.currentRequest = ajax(xhrOpts);
  };

  CwicGranules.prototype._parseOsdd = function (doc) {
    let urls = doc.getElementsByTagNameNS(xmlNamespaces.os, 'Url');
    for (let i = 0; i < urls.length; i++) {
      let url = urls[i];
      if (url.getAttribute('type') =='application/atom+xml') {
        return {
          url: toLocalUrl(url.getAttribute('template'))
        };
      }
    }
    return null;
  };

  CwicGranules.prototype._loadOsdd = function (callback) {
    this.isLoading(true);
    let xhrOpts = {
      method: 'get',
      dataType: 'xml',
      url: this.osddPath,
      retry: () => this._loadOsdd(callback),
      success: (data, status, xhr) => {
        this.osdd(this._parseOsdd(data));
        if (callback) callback();
      },
      complete: () => {
        this.isLoading(!this.currentRequest);
      },
      error: (response, type, reason) => {
        this.isError(true);
        console.log(`Fail (OSDD Load) [${reason}]: ${this.osddPath}`);
      }
    };
    ajax(xhrOpts);
  };


  CwicGranules.prototype.clearExclusions = function (current, callback) {
    this.query.excludedGranules([]);
    this.excludedGranulesList([]);
    this.isLoaded(false);
    this.results([]);
    this._load(this.params(), current, this.results);
  };

  CwicGranules.prototype.transformSpatial = function (granule) {
    // There's some precedence here because granules with multiple shapes typically
    // use simpler shapes as a fallback for clients that can't handle complex shapes
    let source, dest;

    if (granule.polygon) {
      source = 'polygon';
    }
    else if (granule.box) {
      source = 'box';
      dest = 'boxes';
    }
    else if (granule.point) {
      source = 'point';
    }

    if (source) {
      if (!dest) dest = source + 's';
      granule[dest] = CwicUtils.arrayWrap(granule[source]);
      if (dest === 'polygons') {
        granule[dest] = [granule[dest]];
      }
      delete granule[source];
    }
  };

  CwicGranules.prototype._toResults = function (data, dataObj, current, params) {
    let granules = [];
    if (dataObj.feed && dataObj.feed.entry) {
      let entries = CwicUtils.arrayWrap(dataObj.feed.entry);
      for (let i = 0; i < entries.length; i++) {
        let granule = entries[i];
        let links = CwicUtils.arrayWrap(granule.link);
        delete granule.link;
        let hasBrowse = false;
        for (let j = 0; j < links.length; j++) {
          if (links[j].rel == 'icon') {
            hasBrowse = true;
            break;
          }
        }
        this.transformSpatial(granule);
        granule.browse_flag = hasBrowse;
        granule.links = links;
        granules.push(new Granule(granule));
      }
    }
    if (getRootLink(data, 'previous') && dataObj.feed && dataObj.feed.totalResults > 0) {
      return current.concat(granules);
    }
    else {
      return granules;
    }
  };

  CwicGranules.prototype.cwicUrl = function(overrides) {
    if (this.query.singleGranuleId()) {
      return toLocalUrl(this.query.singleGranuleId());
    }
    let params = {};
    let ownParams = this.params();
    for (let key in ownParams) {
      if (ownParams.hasOwnProperty(key))
        params[key] = ownParams[key];
    }
    if (overrides) {
      for (let key in overrides) {
        if (overrides.hasOwnProperty(key))
          params[key] = overrides[key];
      }
    }
    return this._urlFor(params);
  };

  CwicGranules.prototype._computeSearchResponse = function(current, callback) {
    if (!this.osdd() && !this.isLoading.peek()) {
      this.results([]);
      this._load(this.params(), current, callback);
    }
    else {
      let url = this._urlFor(this.params());

      if (this._prevUrl != url) {
        this._prevUrl = url;
        if (url && url.match(/#no-data$/)) {
          this.results([]);
          this.hits(0);
          return;
        }
        this.results([]);
        this.isLoaded(false);
        this._load(url, current, callback);
      }
    }
  };

  CwicGranules.prototype.loadNextPage = function() {
    if (this.hasNextPage() && !this.isLoading()) {
      this._loadAndSet(this.nextPageUrl, this.results());
    }
  };

  return CwicGranules;
})();
export default CwicGranules;
