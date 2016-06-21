import extend from './extend.jsx';

let Temporal = window.edsc.models.ui.Temporal;
let ExclusionParam = window.edsc.models.data.query.ExclusionParam;

class GranuleQuery {
  constructor(parentQuery) {
    this.parentQuery = parentQuery;
    this.temporal = new Temporal();
    this.singleGranuleId = ko.observable(null);
    this.params = ko.computed({
      read: this._computeParams,
      write: this.fromJson,
      deferEvaluation: true,
      owner: this});
    this.excludedGranules = this.queryComponent(new ExclusionParam('exclude', 'cwic_granule_id'), ko.observableArray());
  }
  
  queryComponent(obj, observable, options) {
    if (observable == null) {
      observable = null;
    }
    if (options == null) {
      options = {};
    }
    if (this._all == null) {
      this._all = [];
    }
    if (this._components == null) {
      this._components = [];
    }
    if (this._propagated == null) {
      this._propagated = [];
    }
    if (this._serialized == null) {
      this._serialized = [];
    }
    if (!ko.isObservable(observable)) {
      obj.defaultValue = observable;
      observable = ko.observable(observable);
    }
    observable = observable.extend({
      queryable: obj
    });
    this._all.push(observable);
    if (options.query !== false) {
      this._components.push(observable);
    }
    if (options.propagate) {
      this._propagated.push(observable);
    }
    if (!options.ephemeral) {
      this._serialized.push(observable);
    }
    return observable;
  }

  fromJson(query) {
    if (query.sgd) {
      this.singleGranuleId(query.sgd);
    }
    this.temporal.applied.queryCondition(query.temporal);
    if (query.exclude) {
      this.excludedGranules(query.exclude.cwic_granule_id);
    }
    if (query.cx) {
      this.excludedGranules(query.cx);
    }

  }

  mbr() {
    return this.parentQuery.mbr();
  }

  serializedMbr() {
    let mbr = this.mbr();
    if (mbr) {
      return `${mbr[1]},${mbr[0]},${mbr[3]},${mbr[2]}`;
    }
    return null;
  }

  _computeParams() {
    let result = {};
    let parent = this.parentQuery.globalParams();
    for (let key in parent) {
      if (parent.hasOwnProperty(key)) {
        if (key == 'polygon') {
          result.mbr = this.serializedMbr();
        }
        else {
          result[key] = parent[key];
        }
      }
    }
    let own = this.serialize();
    for (let key in own) {
      if (own.hasOwnProperty(key)) {
        result[key] = own[key];
      }
    }

    return result;
  }

  serialize() {
    let result = {};
    let temporal = this._temporalQuery();
    if (temporal) {
      result.temporal = temporal;
    }
    if (this.singleGranuleId()) {
      result.sgd = this.singleGranuleId();
    }
    if (this.excludedGranules().length > 0) {
      result.cx = this.excludedGranules();
    }
    return result;
  }

  clearFilters() {
    this.fromJson({});
  }

  _temporalQuery() {
    return this.temporal.applied.queryCondition();
  }

  _parentTemporalQuery() {
    return this.parentQuery.temporal.applied.queryCondition();
  }
}

export default GranuleQuery;
