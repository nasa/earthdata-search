export default class CwicDatasourcePlugin {
  constructor(edsc, collection) {
    this._edsc = edsc;
    this._collection = collection;
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
    return null;
  }
};

edscplugin.loaded('datasource.cwic', CwicDatasourcePlugin);
