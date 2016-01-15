import extend from './extend.jsx';

let bind = function(fn, self){
  return function(){
    return fn.apply(self, arguments);
  };
};

let CwicGranules = (function() {
  extend(CwicGranules, window.edsc.models.data.Granules);

  function CwicGranules(query, parentQuery, short_name) {
    this.params = bind(this.params, this);
    this.short_name = short_name;
    CwicGranules.__super__.constructor.apply(this, Array.prototype.slice.call(arguments));
    this.path = '/granules/cwic.json';
  }

  CwicGranules.prototype.params = function() {
    let result = CwicGranules.__super__.params.call(this);
    result.short_name = this.short_name;
    return result;
  };

  return CwicGranules;
})();


export default CwicGranules;
