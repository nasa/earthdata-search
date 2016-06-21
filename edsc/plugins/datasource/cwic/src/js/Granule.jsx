import extend from './extend.jsx';
import * as XmlHelpers from './XmlHelpers.jsx';
import * as CwicUtils from './CwicUtils.jsx';

let ajax = window.edsc.util.xhr.ajax;

let CwicGranule = (function() {
  extend(CwicGranule, window.edsc.models.data.Granule);

  function CwicGranule(jsonData) {
    CwicGranule.__super__.constructor.apply(this, Array.prototype.slice.call(arguments));
  }

  CwicGranule.prototype._computeGranuleDetails = function(callback) {
    var url = '/cwic/edsc_granule/' + encodeURIComponent(this.id);
    this.detailsLoaded(false);
    let xhrOpts = {
      method: 'get',
      dataType: 'xml',
      url: url,
      success: (function(_this) {
        return function(data) {
          var dataObj = XmlHelpers.elToObj(data);
          var serialized = CwicUtils.serializeObj(dataObj.feed);
          _this.details({xml: serialized, native_url: _this.id});
          _this.detailsLoaded(true);
        };
      })(this),
      error: function (response, type, reason) {
        console.log(`Fail (CWIC granule info load) [${reason}]: ${url}`);
      }
    };
    ajax(xhrOpts);
  };

  CwicGranule.prototype.edsc_browse_url = function(w, h) {
    for (var i = 0; i < this.links.length; i ++) {
      if (this.links[i].rel == 'icon') {
        return this.links[i].href;
      }
    }
    return null;
  };

  CwicGranule.prototype.onThumbLoad = function(obj, e) {
    var img = e.target;

    // If the thumbnail itself is big, record it as what we
    // may want to open when the user requests full browse
    if (img.naturalWidth > 256 || img.naturalHeight > 256) {
      this.full_browse_url = img.src;
    }
  };

  CwicGranule.prototype.edsc_full_browse_url = function() {
    // This is kind of a hack because CWIC does not have a standard link relation
    // for large-sized browse, so we look for URLs with extensions of jpg, jpeg,
    // gif, and png, and return the first one which is not marked as the icon.
    // If there's no such relation, we return nothing, which results in there being
    // no link to the full size image.
    for (var i = 0; i < this.links.length; i ++) {
      var href = this.links[i].href;
      if (this.links[i].rel != 'icon' && href.match(/\.(?:gif|jpg|jpeg|png)(?:\?|#|$)/)) {
        return href;
      }
    }
    return this.full_browse_url;
  };

  CwicGranule.prototype.browseDownloadUrl = function() {
    return this.edsc_full_browse_url() || this.edsc_browse_url();
  };

  CwicGranule.prototype.getTemporal = function () {
    let date = this.date || this.temporal;
    return date != null ? this.date.replace('/', ' to ') : null;
  };

  return CwicGranule;
})();


export default CwicGranule;
