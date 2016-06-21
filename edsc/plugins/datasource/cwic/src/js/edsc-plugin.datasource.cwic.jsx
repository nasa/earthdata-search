import Granules from './Granules.jsx';
import GranuleQuery from './GranuleQuery.jsx';

let urlUtil = window.edsc.util.url;

export default class CwicDatasourcePlugin {
  constructor(edsc, collection) {
    this._edsc = edsc;
    this._collection = collection;
    this._query = null;
    this._dataLoaded = ko.observable(false);
    let short_name = collection.json.short_name;
    let osdd_url = `http://cwic.wgiss.ceos.org/opensearch/datasets/${short_name}/osdd.xml`;
    Object.defineProperty(collection, 'granuleQuery', {get: () => {return this.cwicQuery();}});
    collection.osdd_url(osdd_url);

    this.clearFilters = () => {
      this.cwicQuery().clearFilters();
    };

    this.capabilities = {
      timeline: false
    };
  }

  hasCapability(name) {
    return this.capabilities[name] === true || this.capabilities[name] == null;
  }

  destroy(edsc) {
    this._edsc = null;
    this._collection = null;
    this._query = null;
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
    return this.cwicQuery().params();
  }

  toTimelineQueryParams() {
    return {};
  }
  loadAccessOptions(callback, retry) {
    let granules = this.data();
    let query = this.cwicQuery();
    let hits = query.singleGranuleId() == null ? granules.hits() : 1;
    let options = {
      hits: hits,
      methods: [
        {name: 'Download',
         type: 'download',
         all: query.excludedGranules().length == 0,
         count: hits,
         defaults: {accessMethod: [{method: 'Download', type: 'download'}]}}
      ]
    };
    if (this._granules.isLoaded()) {
      callback(options);
    }
  }
  downloadLinks() {
    var result = [];
    if (this.data()) {
      let granules = this.data();
      let url = granules.cwicUrl({count: 100});
      if (url) {
        let downloadUrl = url.replace(/^\/cwic/, '/cwic/edsc_download');
        if (granules.query.excludedGranules()) {
          downloadUrl += "&cx=" + granules.query.excludedGranules().join('!');
        }
        result.push({title: "View Download Links", url: urlUtil.fullPath(downloadUrl)});
      }
    }

    return result;
  }
  hasQueryConfig() {
    return this._query !== null && (Object.keys(this._query.serialize()).length > 0 || (this._query.excludedGranules && this._query.excludedGranules().length > 0));
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
      this._query = new GranuleQuery(collection.query);
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
