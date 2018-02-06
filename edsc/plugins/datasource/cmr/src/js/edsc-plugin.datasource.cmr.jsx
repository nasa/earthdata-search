let GranuleQuery = window.edsc.models.data.query.GranuleQuery,
    Granules = window.edsc.models.data.Granules,
    ajax = window.edsc.util.xhr.ajax,
    urlUtil = window.edsc.util.url;

export default class CmrDatasourcePlugin {

  // Required methods

  constructor(edsc, collection) {
    this._edsc = edsc;
    this._collection = collection;
    this._query = null;
    this._dataLoaded = ko.observable(false);
    Object.defineProperty(collection, 'granuleQuery', {get: () => {return this.cmrQuery();}});
    Object.defineProperty(collection, 'cmrGranulesModel', {get: () => {return this.data();}});

    var self = this;
    this.clearFilters = () => {
      self.cmrQuery().clearFilters();
    };

    this.capabilities = {};
 }

  hasCapability(name) {
    return this.capabilities[name] == true || this.capabilities[name] == null;
  }

  destroy(edsc) {
    this._edsc = null;
    this._collection = null;
    if (this._query) {
      this._query.dispose();
    }
    if (this._granules) {
      this._granules.dispose();
    }
  }
  toBookmarkParams() {
    return this.cmrQuery().serialize();
  }
  fromBookmarkParams(json, fullQuery) {
    let query = this.cmrQuery();
    query.fromJson(json);
    if (fullQuery && fullQuery.sgd) {
      query.singleGranuleId(fullQuery.sgd);
    }
  }
  toQueryParams() {
    let query = this.cmrQuery(),
        params = query.params(),
        singleGranuleId = query.singleGranuleId();
    if (singleGranuleId) {
      params.echo_granule_id = singleGranuleId;
    }
    return params;
  }
  toTimelineQueryParams() {
    return this.toQueryParams();
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
  downloadLinks(projectId) {
    let collection = this._collection;
    let base = urlUtil.fullPath(`/granules/download.html?project=${projectId}&collection=${collection.id}`);
    var result = [
      {title: "View/Download Data Links", url: base.replace('.html', '.txt'), tooltip: 'View or download data URLs'},
      {title: "Download Access Script", url: base.replace('.html', '.sh'), tooltip: 'Download executable shell script (requires UNIX environment)'}
    ];
    if (collection.browseable_granule) {
      result.push({title: "View Browse Image Links", url: `${base}&browse=true`, tooltip: 'View clickable browse links in browser'});
    }
    return result;
  }
  hasQueryConfig() {
    if(this._query == null)
      return false;
    var serialized = this._query.serialize();
    var numOfParams = Object.keys(serialized).length;
    // if 'project' is the only granule search param, don't highlight the has-applied-granule-filters icon
    return numOfParams > 0 && !(serialized['project'] && numOfParams == 1);
  }
  updateFromCollectionData(collectionData) {
    let attributes = collectionData.searchable_attributes;
    if (attributes && this._query) {
      this._query.attributes.definitions(attributes);
    }
  }
  // Suggested methods

  // Implement only if row-specific temporal is supported
  setTemporal(values) {
    let temporal = this.temporal();
    if (temporal) {
      let start = temporal.start,
          end = temporal.stop;
      if (values.hasOwnProperty('recurring')) {
        temporal.isRecurring(values.recurring);
      }
      if (values.hasOwnProperty('startDate')) {
        start.date(values.startDate);
      }
      if (values.hasOwnProperty('endDate')) {
        end.date(values.endDate);
      }
      if (values.hasOwnProperty('startYear')) {
        start.year(values.startYear);
      }
      if (values.hasOwnProperty('endYear')) {
        end.year(values.endYear);
      }
    }
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
    // TODO: Better story for row-specific temporal
    return this.cmrQuery().temporal.applied;
  }

  temporalModel() {
    return this.cmrQuery().temporal;
  }

  granuleDescription() {
    let hits, result;

    if (this._dataLoaded()) {
      hits = this.data().hits();
      if (hits == 0 && this.data().isLoading()) {
        return "";
      }
    }
    else {
      hits = this._collection.granuleCount();
    }
    result = `${hits} Granule`;
    if (hits != 1) {
      result += 's';
    }
    return result;
  }

  // Other methods

  cmrQuery() {
    if (!this._query) {
      let collection = this._collection;
      this._query = new GranuleQuery(collection.id, collection.query, collection.searchable_attributes);
    }
    return this._query;
  }
  data() {
    if (!this._granules) {
      this._granules = new Granules(this.cmrQuery(), this.cmrQuery().parentQuery);
      this._granules.results();
      this._dataLoaded(true);
    }
    return this._granules;
  }
};

edscplugin.loaded('datasource.cmr', CmrDatasourcePlugin);
