export default class CwicDatasourcePlugin {
  constructor(edsc, collection) {
    this._edsc = edsc;
    this._collection = collection;
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
    return null;
  }
  cwicData() {
    return this;
  }
};

edscplugin.loaded('datasource.cwic', CwicDatasourcePlugin);
