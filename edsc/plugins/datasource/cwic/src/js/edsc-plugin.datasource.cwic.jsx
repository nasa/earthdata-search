import Granules from './Granules.jsx';
import GranuleQuery from './GranuleQuery.jsx';
let ajax = window.edsc.util.xhr.ajax;

export default class CwicDatasourcePlugin {
  constructor(edsc, collection) {
    this._edsc = edsc;
    this._collection = collection;
    this._query = null;
    this._dataLoaded = ko.observable(false);
    Object.defineProperty(collection, 'cwicGranuleQuery', {get: () => {return this.cwicQuery();}});
    Object.defineProperty(collection, 'cwicGranulesModel', {get: () => {return this.data();}});
    let short_name = collection.json.short_name;
    let osdd_url = `http://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=${short_name}`;
    collection.osdd_url(osdd_url);
  }

  destroy(edsc) {
    this._edsc = null;
    this._collection = null;
  }

  toBookmarkParams() {
    return {};
  }

  fromBookmarkParams(json, fullQuery) {
  }

  toQueryParams() {
    let query = this.cwicQuery(),
      params = query.params(),
      singleGranuleId = query.singleGranuleId();
    if (singleGranuleId) {
      params.echo_granule_id = singleGranuleId;
    }
    return params;
  }

  loadAccessOptions(callback, retry) {
    ajax({
      dataType: 'json',
      url: '/data/options',
      data: this.toQueryParams(),
      method: 'post',
      retry: retry,
      success: callback
    });
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
    return this.cwicQuery().temporal.applied;
  }

  granuleDescription() {
    return "Int'l / Interagency";
  }

  cwicQuery() {
    if (!this._query) {
      let collection = this._collection;
      this._query = new GranuleQuery(collection.id, collection.query, collection.searchable_attributes);
    }
    return this._query;
  }

  data() {
    if (!this._granules) {
      let collection = this._collection;
      this._granules = new Granules(this.cwicQuery(), this.cwicQuery().parentQuery, collection.json.short_name);
      this._granules.results();
      this._dataLoaded(true);
    }
    return this._granules;
  }
};

edscplugin.loaded('datasource.cwic', CwicDatasourcePlugin);
