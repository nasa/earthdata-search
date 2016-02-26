import extend from './extend.jsx';

let Temporal = window.edsc.models.ui.Temporal;

class GranuleQuery {
  constructor(parentQuery) {
    this.parentQuery = parentQuery;
    this.temporal = new Temporal();
    this.singleGranuleId = ko.observable(null);
    this.params = ko.computed({
      read: this.serialize,
      write: this.fromJson,
      deferEvaluation: true,
      owner: this});
  }

  fromJson(query) {
    this._temporalQuery(query.temporal);
  }

  serialize() {
    let result = {
      temporal: this._temporalQuery()
    };
    return result;
  }

  clearFilters() {
    this.fromJson({});
  }

  _temporalQuery() {
    return this.temporal.applied.queryCondition;
  }
}

let CwicGranuleQuery = (function() {
  extend(CwicGranuleQuery, window.edsc.models.data.query.GranuleQuery);

  function CwicGranuleQuery(collectionId, parentQuery, attributes) {
    CwicGranuleQuery.__super__.constructor.apply(this, Array.prototype.slice.call(arguments));
  }

  return CwicGranuleQuery;
})();


export default CwicGranuleQuery;
