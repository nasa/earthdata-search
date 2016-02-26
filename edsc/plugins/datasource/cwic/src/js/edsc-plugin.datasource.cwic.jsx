import Granules from './Granules.jsx';
import GranuleQuery from './GranuleQuery.jsx';
let ajax = window.edsc.util.xhr.ajax;

export default class CwicDatasourcePlugin {
  constructor(edsc, collection) {
    this._edsc = edsc;
    this._collection = collection;
    this._query = null;
    this._dataLoaded = ko.observable(false);
    let short_name = collection.json.short_name;
    let osdd_url = `http://cwic.wgiss.ceos.org/opensearch/datasets/${short_name}/osdd.xml`;
    collection.osdd_url(osdd_url);

    var self = this;
    this.clearFilters = () => {
      self.cwicQuery().clearFilters();
    };

    this.capabilities = {
      excludeGranules: false
    };
  }

  hasCapability(name) {
    return this.capabilities[name] == true || this.capabilities[name] == null;
  }

  destroy(edsc) {
    this._edsc = null;
    this._collection = null;
  }

  toBookmarkParams() {
    return this.cwicQuery().serialize();
  }

  fromBookmarkParams(json, fullQuery) {
    let query = this.cwicQuery();
    query.fromJson(json);
    if (fullQuery && fullQuery.sgd) {
      query.singleGranuleId(fullQuery.sgd);
    }
  }

  toQueryParams() {
    let query = this.cwicQuery(),
      params = query.params(),
      singleGranuleId = query.singleGranuleId();
    return params;
  }
  toTimelineQueryParams() {
    return {};
  }
  loadAccessOptions(callback, retry) {
    let granules = null;
    let query = this.cwicQuery();
    let hits = query.singleGranuleId() == null ? granules.hits() : 1;
    let options = {
      hits: hits,
      methods: [
        {name: 'Download',
         type: 'download',
         all: true,
         count: hits,
         defaults: {accessMethod: [{method: 'Download', type: 'download'}]}}
      ]
    };
    callback(options);
  }
  downloadLinks() {
    var result = [];
    if (this.data()) {
      let granules = this.data();
      let url = granules.cwicUrl({count: 100});
      if (url) {
        let downloadUrl = url.replace(/^\/cwic/, '/cwic/edsc_download');
        result.push({title: "View Download Links", url: downloadUrl});
      }
    }
    return result;
  }
  hasQueryConfig() {
    return this._query !== null && Object.keys(this._query.serialize()).length > 0;
  }

  updateFromCollectionData(collectionData) {
  }

  getTemporal() {
    let temporal = this.temporal();
    if (temporal) {
      return {
        startDate: temporal.start.date(),
        endDate: temporal.stop.date(),
        starYear: temporal.start.year(),
        endYear: temporal.stop.year(),
        recurring: temporal.isRecurring()
      };
    }
    return null;
  }

  temporal() {
    return this.temporalModel().applied;
  }

  temporalModel() {
    return this.cwicQuery().temporal;
  }

  granuleDescription() {
    return "Int'l / Interagency";
  }

  cwicQuery() {
    if (!this._query) {
      let collection = this._collection;
      this._query = new GranuleQuery(collection.id, collection.query, collection.searchable_attributes);
      let temporal = this._query.temporal;
      temporal.pending.allowRecurring(false);
      temporal.applied.allowRecurring(false);
    }
    return this._query;
  }

  data() {
    if (!this._granules) {
      let collection = this._collection;
      let datasetId = collection.json.short_name;
      this._granules = new Granules(this.cwicQuery(), this.cwicQuery().parentQuery, datasetId);
      this._granules.results();
      this._dataLoaded(true);
    }
    return this._granules;
  }
};

edscplugin.loaded('datasource.cwic', CwicDatasourcePlugin);
