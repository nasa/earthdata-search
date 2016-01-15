import extend from './extend.jsx';

let CwicGranuleQuery = (function() {
  extend(CwicGranuleQuery, window.edsc.models.data.query.GranuleQuery);

  function CwicGranuleQuery(collectionId, parentQuery, attributes) {
    CwicGranuleQuery.__super__.constructor.apply(this, Array.prototype.slice.call(arguments));
  }

  return CwicGranuleQuery;
})();


export default CwicGranuleQuery;
