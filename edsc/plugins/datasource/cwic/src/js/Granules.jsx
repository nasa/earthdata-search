import extend from './extend.jsx';
import Granule from './Granule.jsx';

let ajax = window.edsc.util.xhr.ajax;
let clientId = window.edsc.config.cmrClientId;

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

let arrayWrap = function(obj) {
  if (obj == null) return [];
  return Array === obj.constructor ? obj : [obj];
}

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

let elToObj = function(el) {
  let result;

  let hasChildren = false;
  let childEl = el.firstChild;
  while (childEl) {
    if (childEl.nodeType == Node.ELEMENT_NODE) {
      hasChildren = true;
      break;
    }
    childEl = childEl.nextSibling;
  }

  if (hasChildren) {
    result = {};
    let child = el.firstChild;
    while (child) {
      if (child.nodeType == Node.ELEMENT_NODE) {
        let prop = child.tagName.replace(/^.*:/g, '');
        let obj = elToObj(child);
        if (result.hasOwnProperty(prop)) {
          result[prop] = arrayWrap(result[prop]);
          result[prop].push(obj);
        }
        else {
          result[prop] = obj;
        }
      }
      child = child.nextSibling;
    }
  }
  else if (el.attributes.length == 0 || el.textContent && el.textContent.length > 0) {
    result =  el.textContent;
  }
  else {
    result = {};
    let attrs = el.attributes;
    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i];
      let prop = attr.name.replace(/^.*:/g, '');
      result[prop] = attr.value;
    }
  }
  return result;
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
        else if (key == 'bounding_box') {
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
        dataObj = elToObj(data);
        results = this._toResults(data, dataObj, current, params);
        this.hits(dataObj.feed.totalResults);
        this.nextPageUrl = toLocalUrl(getRootLink(data, 'next'));
        this.hasNextPage(this.nextPageUrl != null);
        let timing = ((new Date() - start) / 1000).toFixed(1);
        this.loadTime(timing);
        if (callback) callback(results);
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

  CwicGranules.prototype._toResults = function (data, dataObj, current, params) {
    let granules = [];
    if (dataObj.feed && dataObj.feed.entry) {
      let entries = arrayWrap(dataObj.feed.entry);
      for (let i = 0; i < entries.length; i++) {
        let granule = entries[0];
        let links = arrayWrap(granule.link);
        delete granule.link;
        let hasBrowse = false;
        for (let j = 0; j < links.length; j++) {
          if (links[i].rel == 'icon') {
            hasBrowse = true;
            break;
          }
        }
        granule.browse_flag = hasBrowse;
        granule.links = links;
        granules.push(new Granule(granule));
      }
    }
    if (getRootLink(data, 'previous')) {
      return current.concat(granules);
    }
    else {
      return granules;
    }
  };

  CwicGranules.prototype.cwicUrl = function(overrides) {
    let params = {};
    let ownParams = this.params();
    for (let key in ownParams) {
      if (ownParams.hasOwnProperty(key))
        params[key] = ownParams[key];
    }
    if (overrides) {
      for (let key in overrides) {
        if (ownParams.hasOwnProperty(key))
          params[key] = ownParams[key];
      }
    }
    return this._urlFor(overrides);
  };

  CwicGranules.prototype._computeSearchResponse = function(current, callback) {
    if (!this.osdd()) {
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
