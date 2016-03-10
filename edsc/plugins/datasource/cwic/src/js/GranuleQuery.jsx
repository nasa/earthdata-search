import extend from './extend.jsx';

let Temporal = window.edsc.models.ui.Temporal;

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
  }

  fromJson(query) {
    if (query.sgd) {
      this.singleGranuleId(query.sgd);
    }
    this.temporal.applied.queryCondition(query.temporal);
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
