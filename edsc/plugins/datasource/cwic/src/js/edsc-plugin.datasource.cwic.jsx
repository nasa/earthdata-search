let GranuleQuery = window.edsc.models.data.query.GranuleQuery,
  Granules = window.edsc.models.data.Granules,
  ajax = window.edsc.util.xhr.ajax;

export default class CwicDatasourcePlugin {
  constructor(edsc, collection) {
    this._edsc = edsc;
    this._collection = collection;
    this._dataLoaded = ko.observable(false);
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
    return {};
  }
  loadAccessOptions(callback, retry) {
  }
  hasQueryConfig() {
    return false;
  }
  updateFromCollectionData(collectionData) {
  }

  granuleDescription() {
    return "Int'l / Interagency";
  }
  cwicQuery() {
    if (!this._query) {
      let collection = this._collection;
      this._query = new GranuleQuery(collection.id, collection.query, collection.searchable_attributes, 'cwic', collection.json.short_name);
    }
    return this._query;
  }
  cwicData() {
    if (!this._granules) {
      this._granules = new Granules(this.cwicQuery(), this.cwicQuery().parentQuery);
      this._granules.results();
      this._dataLoaded(true);
    }
    return this._granules;
  }
};

edscplugin.loaded('datasource.cwic', CwicDatasourcePlugin);
