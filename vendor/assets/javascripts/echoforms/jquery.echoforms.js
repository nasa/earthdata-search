require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  pluginName: "echoforms"
};


},{}],2:[function(require,module,exports){
var Base, util;

util = require('../util.coffee');

Base = (function() {
  function Base(message) {
    this.message = message;
  }

  Base.prototype.check = function(value, model, resolver) {
    return util.warn("" + this.constructor.name + " must override check");
  };

  return Base;

})();

module.exports = Base;


},{"../util.coffee":33}],3:[function(require,module,exports){
module.exports = {
  Pattern: require('./pattern.coffee'),
  Required: require('./required.coffee'),
  Type: require('./type.coffee'),
  XPath: require('./xpath.coffee')
};


},{"./pattern.coffee":4,"./required.coffee":5,"./type.coffee":6,"./xpath.coffee":7}],4:[function(require,module,exports){
var Base, Pattern,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./base.coffee');

Pattern = (function(_super) {
  __extends(Pattern, _super);

  function Pattern(patternStr, message) {
    this.pattern = new RegExp('^' + patternStr + '$');
    Pattern.__super__.constructor.call(this, message != null ? message : 'Invalid');
  }

  Pattern.prototype.check = function(value, model, resolver) {
    return !value || (value instanceof Array && value.length === 0) || this.pattern.exec(value) !== null;
  };

  return Pattern;

})(Base);

module.exports = Pattern;


},{"./base.coffee":2}],5:[function(require,module,exports){
var Base, Required, execXPath,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./base.coffee');

execXPath = require('../util.coffee').execXPath;

Required = (function(_super) {
  __extends(Required, _super);

  function Required(xpath, message) {
    this.xpath = xpath;
    if (message == null) {
      message = "Required field";
    }
    Required.__super__.constructor.call(this, message);
  }

  Required.prototype.check = function(value, model, resolver) {
    if (value instanceof Array && value.length === 0) {
      value = null;
    }
    return !!value || !execXPath(model, this.xpath, resolver);
  };

  return Required;

})(Base);

module.exports = Required;


},{"../util.coffee":33,"./base.coffee":2}],6:[function(require,module,exports){
var Base, Type, util,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./base.coffee');

util = require('../util.coffee');

Type = (function(_super) {
  __extends(Type, _super);

  Type.MIN_SHORT = -Math.pow(2, 15);

  Type.MAX_SHORT = Math.pow(2, 15) - 1;

  Type.MIN_INT = -Math.pow(2, 31);

  Type.MAX_INT = Math.pow(2, 31) - 1;

  Type.MIN_LONG = -Math.pow(2, 63);

  Type.MAX_LONG = Math.pow(2, 63) - 1;

  function Type(rawType, message) {
    var a, human_type, match;
    if (message == null) {
      message = null;
    }
    match = rawType.match(/^(?:[^:]+:)?(.*)$/);
    this.type = match ? match[1] : rawType;
    human_type = (function() {
      switch (this.type) {
        case "double":
          return "number";
        case "long":
          return "integer between -2^63 and 2^63-1";
        case "int":
          return "integer between -2,147,483,648 and 2,147,483,647";
        case "short":
          return "integer between -32,768 and 32,767";
        case "datetime":
          return "date/time with format YYYY-MM-DDTHH:MM:SS";
        case "boolean":
          return "true or false";
        default:
          return this.type;
      }
    }).call(this);
    a = /^[aeiou]/i.test(human_type) ? 'an' : 'a';
    Type.__super__.constructor.call(this, message != null ? message : "Value must be " + a + " " + human_type);
  }

  Type.prototype.check = function(value, model, resolver) {
    if (!value) {
      return true;
    }
    switch (this.type) {
      case "string":
        return true;
      case "anyuri":
        return true;
      case "double":
        return this.checkDouble(value);
      case "long":
        return this.checkLong(value);
      case "int":
        return this.checkInt(value);
      case "short":
        return this.checkShort(value);
      case "datetime":
        return this.checkDateTime(value);
      case "boolean":
        return this.checkBoolean(value);
      default:
        util.warn("Unable to validate type: ", this.type);
        return true;
    }
  };

  Type.prototype._checkIntegerRange = function(min, max, value) {
    var number;
    number = Number(value);
    return !isNaN(number) && number >= min && number <= max && value.indexOf('.') === -1;
  };

  Type.prototype.checkDouble = function(value) {
    return !isNaN(Number(value));
  };

  Type.prototype.checkLong = function(value) {
    return this._checkIntegerRange(Type.MIN_LONG, Type.MAX_LONG, value);
  };

  Type.prototype.checkInt = function(value) {
    return this._checkIntegerRange(Type.MIN_INT, Type.MAX_INT, value);
  };

  Type.prototype.checkShort = function(value) {
    return this._checkIntegerRange(Type.MIN_SHORT, Type.MAX_SHORT, value);
  };

  Type.prototype.checkBoolean = function(value) {
    return value === 'true' || value === 'false';
  };

  Type.prototype.checkDateTime = function(value) {
    var date, day, hour, minute, month, second, t, time, year, _ref, _ref1, _ref2;
    if (!value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
      return false;
    }
    _ref = value.split('T'), date = _ref[0], time = _ref[1];
    _ref1 = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = date.split('-');
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        t = _ref1[_i];
        _results.push(parseInt(t, 10));
      }
      return _results;
    })(), year = _ref1[0], month = _ref1[1], day = _ref1[2];
    _ref2 = (function() {
      var _i, _len, _ref2, _results;
      _ref2 = time.split(':');
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        t = _ref2[_i];
        _results.push(parseInt(t, 10));
      }
      return _results;
    })(), hour = _ref2[0], minute = _ref2[1], second = _ref2[2];
    return (1 <= month && month <= 12) && (1 <= day && day <= 31) && hour < 24 && minute < 60 && second < 60;
  };

  return Type;

})(Base);

module.exports = Type;


},{"../util.coffee":33,"./base.coffee":2}],7:[function(require,module,exports){
var Base, XPath, execXPath,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./base.coffee');

execXPath = require('../util.coffee').execXPath;

XPath = (function(_super) {
  __extends(XPath, _super);

  function XPath(xpath, message) {
    this.xpath = xpath;
    XPath.__super__.constructor.call(this, message != null ? message : 'Invalid');
  }

  XPath.prototype.check = function(value, model, resolver) {
    return execXPath(model, this.xpath, resolver);
  };

  return XPath;

})(Base);

module.exports = XPath;


},{"../util.coffee":33,"./base.coffee":2}],8:[function(require,module,exports){
var $, Base, constraints, util,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

constraints = require('../constraints/index.coffee');

$ = require('jquery');

util = require('../util.coffee');

Base = (function() {
  Base.echoformsControlUniqueId = 0;

  function Base(ui, model, controlClasses, resolver) {
    var help, _i, _len, _ref, _ref1;
    this.ui = ui;
    this.model = model;
    this.controlClasses = controlClasses;
    this.resolver = resolver;
    this.onChange = __bind(this.onChange, this);
    this.changed = __bind(this.changed, this);
    this.refExpr = ui.attr('ref');
    this.id = (_ref = ui.attr('id')) != null ? _ref : "echoforms-control-" + (Base.echoformsControlUniqueId++);
    this.relevantExpr = ui.attr('relevant');
    this.requiredExpr = ui.attr('required');
    this.readonlyExpr = ui.attr('readonly');
    this.label = ui.attr('label');
    _ref1 = ui.children('help');
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      help = _ref1[_i];
      this.help = $(help).text();
    }
    this.loadConstraints();
    this.el = this.buildDom();
  }

  Base.prototype.loadConstraints = function() {
    var message, node, patternNode, xpathNode, _i, _len, _ref, _results;
    this.constraints = [];
    if (this.requiredExpr) {
      this.requiredConstraint = new constraints.Required(this.requiredExpr);
      this.constraints.push(this.requiredConstraint);
    }
    _ref = this.ui.find('> constraints > constraint');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      node = $(node);
      message = node.children('alert').text();
      patternNode = node.children('pattern');
      xpathNode = node.children('xpath');
      if (patternNode.length > 0) {
        this.constraints.push(new constraints.Pattern(patternNode.text(), message));
      }
      if (xpathNode.length > 0) {
        _results.push(this.constraints.push(new constraints.XPath(xpathNode.text(), message)));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Base.prototype.required = function() {
    if (this.requiredConstraint != null) {
      return !this.requiredConstraint.check(void 0, this.model, this.resolver);
    }
  };

  Base.prototype.ref = function() {
    if (this.refExpr != null) {
      return $(this.xpath(this.refExpr));
    } else {
      return this.model;
    }
  };

  Base.prototype.refValue = function() {
    var exception;
    try {
      if (this.refExpr != null) {
        return $.trim(this.ref().text());
      } else {
        return void 0;
      }
    } catch (_error) {
      exception = _error;
      throw "" + exception + "<br/>Error found while accessing the model element associated with form ui control: [" + ($('<div/>').text(this.ui[0].outerHTML).html()) + "].";
    }
  };

  Base.prototype.inputValue = function() {
    return util.warn("" + this.constructor.name + " must override inputValue");
  };

  Base.prototype.loadFromModel = function() {};

  Base.prototype.validate = function() {
    var c, errors, readonly, relevant;
    relevant = (this.relevantExpr == null) || !!this.xpath(this.relevantExpr);
    readonly = (this.readonlyExpr != null) && !!this.xpath(this.readonlyExpr);
    if (this.relevantExpr != null) {
      this.relevant(relevant);
    }
    if (this.readonlyExpr != null) {
      this.readonly(readonly);
    }
    errors = (function() {
      var _i, _len, _ref, _ref1, _results;
      _ref = this.constraints;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (!c.check((_ref1 = this.refValue()) != null ? _ref1 : this.inputValue(), this.model, this.resolver)) {
          _results.push(c.message);
        }
      }
      return _results;
    }).call(this);
    return this.setErrors(errors);
  };

  Base.prototype.saveToModel = function() {};

  Base.prototype.xpath = function(xpath) {
    return util.execXPath(this.model, xpath, this.resolver);
  };

  Base.prototype.element = function() {
    return this.el != null ? this.el : this.el = this.buildDom();
  };

  Base.prototype.isChanged = function(newValue) {
    return this.refValue() !== this.inputValue() || !this.refExpr;
  };

  Base.prototype.changed = function() {
    return this.el.trigger('echoforms:modelchange');
  };

  Base.prototype.relevant = function(arg) {
    var isRelevant, ref;
    if (arg != null) {
      isRelevant = !!arg;
      if (isRelevant !== this.relevant()) {
        this.el.toggleClass('echoforms-irrelevant', !isRelevant);
        this.el.toggle(isRelevant);
        ref = this.ref();
        if (isRelevant) {
          return ref[0].removeAttribute('pruned');
        } else {
          return ref[0].setAttribute('pruned', 'true');
        }
      }
    } else {
      return !this.el.hasClass('echoforms-irrelevant');
    }
  };

  Base.prototype.readonly = function(arg) {
    var isReadonly;
    if (arg != null) {
      isReadonly = !!arg;
      if (isReadonly !== this.readonly()) {
        this.el.toggleClass('echoforms-readonly ui-state-disabled', isReadonly);
        return this.updateReadonly(isReadonly);
      }
    } else {
      return this.el.hasClass('echoforms-readonly');
    }
  };

  Base.prototype.updateReadonly = function(isReadonly) {
    this.inputs().attr('disabled', isReadonly);
    return this.inputs().attr('readonly', isReadonly);
  };

  Base.prototype.onChange = function(e) {
    if (this.isChanged()) {
      this.saveToModel();
      return this.changed();
    }
  };

  Base.prototype.buildLabelDom = function() {
    if (this.label != null) {
      return $('<label>', {
        "class": 'echoforms-label',
        "for": "" + this.id + "-element"
      }).text(this.label);
    } else {
      return $();
    }
  };

  Base.prototype.buildHelpDom = function() {
    var help, result, _i, _len, _ref;
    result = $('<div>', {
      "class": 'echoforms-help'
    });
    _ref = this.ui.children('help');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      help = _ref[_i];
      $('<p>', {
        "class": 'echoforms-help-item'
      }).text($(help).text()).appendTo(result);
    }
    return result;
  };

  Base.prototype.buildControlDom = function() {
    return $("<div>", {
      id: this.id,
      "class": "echoforms-control echoforms-control-" + this.ui[0].nodeName
    });
  };

  Base.prototype.buildElementsDom = function() {
    return $('<div>', {
      "class": 'echoforms-elements'
    });
  };

  Base.prototype.buildErrorsDom = function() {
    return $('<div>', {
      "class": 'echoforms-errors'
    });
  };

  Base.prototype.setErrors = function(messages) {
    var error, errors, message, _i, _len;
    errors = $();
    for (_i = 0, _len = messages.length; _i < _len; _i++) {
      message = messages[_i];
      error = $('<div class="echoforms-error">');
      error.text(message);
      errors = errors.add(error);
    }
    return this.el.children('.echoforms-errors').empty().append(errors);
  };

  Base.prototype.buildDom = function(classes) {
    if (classes == null) {
      classes = null;
    }
    return this.buildControlDom().append(this.buildLabelDom()).append(this.buildElementsDom()).append(this.buildErrorsDom()).append(this.buildHelpDom());
  };

  Base.prototype.addedToDom = function() {};

  return Base;

})();

module.exports = Base;


},{"../constraints/index.coffee":3,"../util.coffee":33,"jquery":"usFOt+"}],9:[function(require,module,exports){
var Checkbox, Input, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Input = require('./input.coffee');

Checkbox = (function(_super) {
  __extends(Checkbox, _super);

  function Checkbox() {
    _ref = Checkbox.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Checkbox.selector = 'input[type$=boolean]';

  Checkbox.prototype.inputClass = 'checkbox';

  Checkbox.prototype.inputElementType = 'checkbox';

  Checkbox.prototype.inputValue = function() {
    return this.inputs()[0].checked.toString();
  };

  Checkbox.prototype.loadFromModel = function() {
    Checkbox.__super__.loadFromModel.call(this);
    if (this.refExpr) {
      return this.inputs()[0].checked = this.refValue() === 'true';
    }
  };

  Checkbox.prototype.buildDom = function() {
    var result;
    result = Checkbox.__super__.buildDom.call(this);
    result.addClass('echoforms-control-checkbox');
    result.children('.echoforms-elements').after(result.children('.echoforms-label'));
    return result;
  };

  return Checkbox;

})(Input);

module.exports = Checkbox;


},{"./input.coffee":15}],10:[function(require,module,exports){
var $, Range, RangeSlider, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = require('jquery');

Range = require('../range.coffee');

RangeSlider = (function(_super) {
  __extends(RangeSlider, _super);

  function RangeSlider() {
    _ref = RangeSlider.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  RangeSlider.selector = 'range';

  RangeSlider.prototype.loadFromModel = function() {
    RangeSlider.__super__.loadFromModel.call(this);
    return this.inputs().change();
  };

  RangeSlider.prototype.addedToDom = function() {
    var input;
    RangeSlider.__super__.addedToDom.call(this);
    input = this.inputs();
    $('<div/>').addClass('slider-output').insertAfter(input);
    input.bind('slider:ready slider:changed', function(e, data) {
      return $(this).nextAll('.slider-output').html(input.val());
    });
    return input.simpleSlider({
      snap: true,
      range: [this.start, this.end],
      step: this.step,
      classPrefix: 'echoforms'
    });
  };

  return RangeSlider;

})(Range);

module.exports = RangeSlider;


},{"../range.coffee":17,"jquery":"usFOt+"}],11:[function(require,module,exports){
var Form, Grouping, util,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Grouping = require('./grouping.coffee');

util = require('../util.coffee');

Form = (function(_super) {
  __extends(Form, _super);

  function Form(ui, model, controlClasses, resolver) {
    var _this = this;
    Form.__super__.constructor.call(this, ui, model, controlClasses, resolver);
    this.el.bind('echoforms:modelchange', function() {
      _this.loadFromModel();
      return _this.validate();
    });
    this.loadFromModel();
    this.validate();
  }

  Form.prototype.ref = function() {
    return this.model.children();
  };

  Form.prototype.isValid = function() {
    return this.el.find('.echoforms-error:visible').length === 0;
  };

  Form.prototype.serialize = function(options) {
    var model;
    if (options == null) {
      options = {};
    }
    model = this.model.children().clone();
    if ((options.prune == null) || options.prune === true) {
      model.find('*[pruned=true]').remove();
    }
    return util.printDOMToString(model[0]);
  };

  return Form;

})(Grouping);

module.exports = Form;


},{"../util.coffee":33,"./grouping.coffee":13}],12:[function(require,module,exports){
var Group, Grouping, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Grouping = require('./grouping.coffee');

Group = (function(_super) {
  __extends(Group, _super);

  function Group() {
    _ref = Group.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Group.selector = 'group';

  return Group;

})(Grouping);

module.exports = Group;


},{"./grouping.coffee":13}],13:[function(require,module,exports){
var $, Base, Grouping, util,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = require('jquery');

Base = require('./base.coffee');

util = require('../util.coffee');

Grouping = (function(_super) {
  __extends(Grouping, _super);

  function Grouping(ui, model, controlClasses, resolver) {
    ui.removeAttr('required');
    Grouping.__super__.constructor.call(this, ui, model, controlClasses, resolver);
  }

  Grouping.prototype.inputs = function() {
    return $();
  };

  Grouping.prototype.loadFromModel = function() {
    var control, _i, _len, _ref, _results;
    Grouping.__super__.loadFromModel.call(this);
    _ref = this.controls;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _results.push(control.loadFromModel());
    }
    return _results;
  };

  Grouping.prototype.buildLabelDom = function() {
    if (this.label != null) {
      return $('<h1>', {
        "class": 'echoforms-label'
      }).text(this.label);
    } else {
      return $();
    }
  };

  Grouping.prototype.buildDom = function() {
    var ControlClass, child, childModel, children, control, controls, root, ui, _i, _j, _len, _len1, _ref, _ref1;
    root = Grouping.__super__.buildDom.call(this).addClass('echoforms-grouping-control');
    root.children('.echoforms-label').after(root.children('.echoforms-help'));
    childModel = this.ref();
    if (childModel.length < 1) {
      util.error("Could not find the model element associated with this group.  Verify that @ref [" + this.refExpr + "] is correct and that the namespace is set correctly");
    }
    ui = this.ui;
    children = $();
    this.controls = controls = [];
    _ref = ui.children();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (child.nodeName === 'help' || child.nodeName === 'constraints') {
        continue;
      }
      _ref1 = this.controlClasses;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        ControlClass = _ref1[_j];
        if ($(child).is(ControlClass.selector)) {
          control = new ControlClass($(child), childModel, this.controlClasses, this.resolver);
          controls.push(control);
          children = children.add(control.el);
          break;
        }
      }
    }
    root.find('.echoforms-elements').replaceWith($('<div class="echoforms-children">').append(children));
    return root;
  };

  Grouping.prototype.updateReadonly = function(isReadonly) {
    var control, _i, _len, _ref, _results;
    Grouping.__super__.updateReadonly.call(this, isReadonly);
    _ref = this.controls;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _results.push(control.updateReadonly(isReadonly));
    }
    return _results;
  };

  Grouping.prototype.validate = function() {
    var control, _i, _len, _ref, _results;
    Grouping.__super__.validate.call(this);
    _ref = this.controls;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _results.push(control.validate());
    }
    return _results;
  };

  Grouping.prototype.addedToDom = function() {
    var control, _i, _len, _ref, _results;
    Grouping.__super__.addedToDom.call(this);
    _ref = this.controls;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _results.push(control.addedToDom());
    }
    return _results;
  };

  return Grouping;

})(Base);

module.exports = Grouping;


},{"../util.coffee":33,"./base.coffee":8,"jquery":"usFOt+"}],14:[function(require,module,exports){
var classes, matchList;

classes = {
  Checkbox: require('./checkbox.coffee'),
  Input: require('./input.coffee'),
  UrlOutput: require('./urloutput.coffee'),
  Output: require('./output.coffee'),
  Select: require('./select.coffee'),
  Range: require('./range.coffee'),
  Secret: require('./secret.coffee'),
  Textarea: require('./textarea.coffee'),
  Group: require('./group.coffee'),
  Select: require('./select.coffee'),
  Tree: require('./tree.coffee'),
  TreeItem: require('./treeitem.coffee'),
  Selectref: require('./selectref.coffee'),
  Base: require('./base.coffee'),
  Typed: require('./typed.coffee'),
  Grouping: require('./grouping.coffee')
};

matchList = [classes.Checkbox, classes.Input, classes.UrlOutput, classes.Output, classes.Select, classes.Range, classes.Secret, classes.Group, classes.Select, classes.Selectref, classes.Tree, classes.TreeItem, classes.Textarea];

module.exports = {
  matchList: matchList,
  classes: classes,
  extras: {
    RangeSlider: require('./extras/rangeslider.coffee')
  }
};


},{"./base.coffee":8,"./checkbox.coffee":9,"./extras/rangeslider.coffee":10,"./group.coffee":12,"./grouping.coffee":13,"./input.coffee":15,"./output.coffee":16,"./range.coffee":17,"./secret.coffee":18,"./select.coffee":19,"./selectref.coffee":20,"./textarea.coffee":21,"./tree.coffee":22,"./treeitem.coffee":23,"./typed.coffee":24,"./urloutput.coffee":25}],15:[function(require,module,exports){
var Input, Typed, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Typed = require('./typed.coffee');

Input = (function(_super) {
  __extends(Input, _super);

  function Input() {
    _ref = Input.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Input.selector = 'input';

  Input.prototype.inputClass = 'input';

  Input.prototype.inputTag = 'input';

  Input.prototype.inputElementType = 'text';

  Input.prototype.inputAttrs = function() {
    var attrs;
    attrs = Input.__super__.inputAttrs.call(this);
    attrs['type'] = this.inputElementType;
    if (this.inputType === 'datetime') {
      attrs['placeholder'] = 'YYYY-MM-DDTHH:MM:SS';
    }
    return attrs;
  };

  return Input;

})(Typed);

module.exports = Input;


},{"./typed.coffee":24}],16:[function(require,module,exports){
var $, Output, Typed,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = require('jquery');

Typed = require('./typed.coffee');

Output = (function(_super) {
  __extends(Output, _super);

  Output.selector = 'output';

  Output.prototype.inputTag = 'p';

  function Output(ui, model, controlClasses, resolver) {
    this.valueExpr = ui.attr('value');
    Output.__super__.constructor.call(this, ui, model, controlClasses, resolver);
  }

  Output.prototype.inputs = function() {
    return $();
  };

  Output.prototype.inputAttrs = function() {
    var attrs;
    attrs = Output.__super__.inputAttrs.call(this);
    delete attrs.autocomplete;
    return attrs;
  };

  Output.prototype.refValue = function() {
    if (this.valueExpr) {
      return this.xpath(this.valueExpr);
    } else {
      return Output.__super__.refValue.call(this);
    }
  };

  Output.prototype.loadFromModel = function() {
    var exception;
    try {
      Output.__super__.loadFromModel.call(this);
      if (this.refExpr || this.valueExpr) {
        return this.el.find('.echoforms-elements > p').text(this.refValue());
      }
    } catch (_error) {
      exception = _error;
      throw "" + exception + "<br/>Error found while setting initial value of output control: [" + ($('<div/>').text(this.ui[0].outerHTML).html()) + "].";
    }
  };

  return Output;

})(Typed);

module.exports = Output;


},{"./typed.coffee":24,"jquery":"usFOt+"}],17:[function(require,module,exports){
var Input, Range,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Input = require('./input.coffee');

Range = (function(_super) {
  __extends(Range, _super);

  Range.selector = 'range';

  function Range(ui, model, controlClasses, resolver) {
    this.start = parseInt(ui.attr('start'), 10);
    this.end = parseInt(ui.attr('end'), 10);
    this.step = parseInt(ui.attr('step'), 10);
    Range.__super__.constructor.call(this, ui, model, controlClasses, resolver);
  }

  return Range;

})(Input);

module.exports = Range;


},{"./input.coffee":15}],18:[function(require,module,exports){
var Input, Secret, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Input = require('./input.coffee');

Secret = (function(_super) {
  __extends(Secret, _super);

  function Secret() {
    _ref = Secret.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Secret.selector = 'secret';

  Secret.prototype.inputElementType = 'password';

  return Secret;

})(Input);

module.exports = Secret;


},{"./input.coffee":15}],19:[function(require,module,exports){
var $, Select, Typed,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = require('jquery');

Typed = require('./typed.coffee');

Select = (function(_super) {
  __extends(Select, _super);

  Select.selector = 'select';

  Select.prototype.inputTag = 'select';

  function Select(ui, model, controlClasses, resolver) {
    var item, label, value;
    this.isMultiple = ui.attr('multiple') === 'true';
    this.valueElementName = ui.attr('valueElementName');
    this.items = (function() {
      var _i, _len, _ref, _ref1, _results;
      _ref = ui.children('item');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _ref1 = [$(item).attr('label'), $(item).attr('value')], label = _ref1[0], value = _ref1[1];
        if ($(item).attr('value') === '') {
          this.hasBlankOption = true;
        }
        if (!((label != null) && label.length > 0)) {
          label = value;
        }
        _results.push([label, value]);
      }
      return _results;
    }).call(this);
    Select.__super__.constructor.call(this, ui, model, controlClasses, resolver);
  }

  Select.prototype.valueElementTagName = function(root) {
    var nameParts, ns;
    if (root == null) {
      root = this.ref();
    }
    nameParts = [this.valueElementName];
    if (/:/.test(root[0].nodeName)) {
      ns = root[0].nodeName.split(':').shift();
    }
    if (ns != null) {
      nameParts.unshift(ns);
    }
    return nameParts.join(':');
  };

  Select.prototype.refValue = function() {
    var child, _i, _len, _ref, _results;
    if ((this.valueElementName != null) && (this.refExpr != null)) {
      _ref = this.ref().children();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push($(child).text());
      }
      return _results;
    } else {
      return Select.__super__.refValue.call(this);
    }
  };

  Select.prototype.saveToModel = function() {
    var element, node, root, tagname, value, _i, _len, _ref, _results;
    if ((this.valueElementName != null) && (this.refExpr != null)) {
      root = this.ref().empty();
      tagname = this.valueElementTagName(root);
      _ref = this.inputValue();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        value = _ref[_i];
        element = document.createElementNS(root[0].namespaceURI, tagname);
        node = $(element).text(value);
        root.append(node);
        _results.push(node[0].namespaceURI = root[0].namespaceURI);
      }
      return _results;
    } else {
      return Select.__super__.saveToModel.call(this);
    }
  };

  Select.prototype.loadFromModel = function() {
    var node, value;
    if ((this.valueElementName != null) && (this.refExpr != null)) {
      this.validate();
      value = (function() {
        var _i, _len, _ref, _results;
        _ref = this.ref().children();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          _results.push($(node).text());
        }
        return _results;
      }).call(this);
      if (!this.isMultiple) {
        value = value[0];
      }
      return this.inputs().val(value);
    } else {
      return Select.__super__.loadFromModel.call(this);
    }
  };

  Select.prototype.inputValue = function() {
    var result;
    result = this.inputs().val();
    if ((this.valueElementName != null) && !(result instanceof Array)) {
      result = (result != null) && result !== '' ? [result] : [];
    }
    return result;
  };

  Select.prototype.inputAttrs = function() {
    return $.extend(Select.__super__.inputAttrs.call(this), {
      multiple: this.isMultiple
    });
  };

  Select.prototype.hasModelVal = function() {
    return this.ref().children().length > 0;
  };

  Select.prototype.buildElementsDom = function() {
    var el, label, result, value, _i, _len, _ref, _ref1;
    result = Select.__super__.buildElementsDom.call(this);
    el = result.children('select');
    if (this.required()) {
      if (!(this.hasBlankOption || this.hasModelVal())) {
        el.append('<option value=""> -- Select a value -- </option>');
      }
    } else {
      if (!(this.hasBlankOption || this.hasModelVal())) {
        el.append('<option value=""> -- No Selection -- </option>');
      }
    }
    _ref = this.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _ref1 = _ref[_i], label = _ref1[0], value = _ref1[1];
      $('<option>', {
        value: value
      }).text(label).appendTo(el);
    }
    return result;
  };

  return Select;

})(Typed);

module.exports = Select;


},{"./typed.coffee":24,"jquery":"usFOt+"}],20:[function(require,module,exports){
var Select, Selectref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Select = require('./select.coffee');

Selectref = (function(_super) {
  __extends(Selectref, _super);

  Selectref.selector = 'selectref';

  function Selectref(ui, model, controlClasses, resolver) {
    var valueElementName;
    valueElementName = ui.attr('valueElementName');
    if (valueElementName == null) {
      ui.attr('valueElementName', 'value');
    }
    Selectref.__super__.constructor.call(this, ui, model, controlClasses, resolver);
  }

  Selectref.prototype.buildDom = function() {
    return Selectref.__super__.buildDom.call(this).addClass('echoforms-control-select');
  };

  return Selectref;

})(Select);

module.exports = Selectref;


},{"./select.coffee":19}],21:[function(require,module,exports){
var Textarea, Typed, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Typed = require('./typed.coffee');

Textarea = (function(_super) {
  __extends(Textarea, _super);

  function Textarea() {
    _ref = Textarea.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Textarea.selector = 'textarea';

  Textarea.prototype.inputTag = 'textarea';

  return Textarea;

})(Typed);

module.exports = Textarea;


},{"./typed.coffee":24}],22:[function(require,module,exports){
var $, Base, Tree, TreeItem, Typed,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$ = require('jquery');

Typed = require('./typed.coffee');

TreeItem = require('./treeitem.coffee');

Base = require('./base.coffee');

Tree = (function(_super) {
  __extends(Tree, _super);

  Tree.selector = 'tree';

  Tree.prototype.inputTag = 'div';

  function Tree(ui, model, controlClasses, resolver) {
    var id, item;
    id = ui.attr('id');
    if (id && id !== 'control') {
      id += "-" + (Base.echoformsControlUniqueId++);
      ui.attr('id', id);
    }
    this.separator = ui.attr('separator');
    this.cascade = ui.attr('cascade') != null ? ui.attr('cascade') === "true" : true;
    this.valueElementName = ui.attr('valueElementName') || 'value';
    this.items = (function() {
      var _i, _len, _ref, _results;
      _ref = ui.children('item');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(new TreeItem($(item), model, controlClasses, resolver, '', this.separator));
      }
      return _results;
    }).call(this);
    Tree.__super__.constructor.call(this, ui, model, controlClasses, resolver);
  }

  Tree.prototype.valueElementTagName = function(root) {
    var nameParts, ns;
    if (root == null) {
      root = this.ref();
    }
    nameParts = [this.valueElementName];
    if (/:/.test(root[0].nodeName)) {
      ns = root[0].nodeName.split(':').shift();
    }
    if (ns != null) {
      nameParts.unshift(ns);
    }
    return nameParts.join(':');
  };

  Tree.prototype.refValue = function() {
    var child, _i, _len, _ref, _results;
    if ((this.valueElementName != null) && (this.refExpr != null)) {
      _ref = this.ref().children();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push($(child).text());
      }
      return _results;
    } else {
      return Tree.__super__.refValue.call(this);
    }
  };

  Tree.prototype.saveToModel = function() {
    var element, node, root, tagname, value, _i, _len, _ref, _results;
    if ((this.valueElementName != null) && (this.refExpr != null)) {
      root = this.ref().empty();
      tagname = this.valueElementTagName(root);
      _ref = this.inputValue();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        value = _ref[_i];
        element = document.createElementNS(root[0].namespaceURI, tagname);
        node = $(element).text(value);
        root.append(node);
        _results.push(node[0].namespaceURI = root[0].namespaceURI);
      }
      return _results;
    } else {
      return Tree.__super__.saveToModel.call(this);
    }
  };

  Tree.prototype.loadFromModel = function() {};

  Tree.prototype.modelValues = function() {
    var value, values;
    if ((this.valueElementName != null) && (this.refExpr != null)) {
      values = (function() {
        var _i, _len, _ref, _results;
        _ref = this.ref().children();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          value = _ref[_i];
          _results.push($(value).text());
        }
        return _results;
      }).call(this);
      return values;
    } else {
      return [];
    }
  };

  Tree.prototype.inputs = function() {
    return this.el.find('div.jstree');
  };

  Tree.prototype.inputValue = function() {
    return this.inputs().jstree("get_selected", "full").map(function(node) {
      if (node.li_attr && node.li_attr.node_value) {
        return node.li_attr.node_value;
      }
    });
  };

  Tree.prototype.inputAttrs = function() {
    return $.extend(Tree.__super__.inputAttrs.call(this), {
      separator: this.separator,
      cascade: this.cascade
    });
  };

  Tree.prototype.buildElementsDom = function() {
    var i, items, model_val, nodes, result, root, start, ul;
    start = new Date().getTime();
    result = Tree.__super__.buildElementsDom.call(this);
    root = result.children('div');
    root.addClass('jstree');
    root.append('<ul>');
    ul = root.children('ul');
    i = 0;
    items = this.items;
    (function() {
      var item, j, node, _i, _ref, _results;
      _results = [];
      for (j = _i = i, _ref = items.length - 1; _i <= _ref; j = _i += 1) {
        item = items[j];
        if (item == null) {
          break;
        }
        node = item.buildElementsDom();
        node.appendTo(ul);
        if (i < (items.length - 1) && (new Date().getTime() - start > 40)) {
          console.log("Tree construction yielding to browser to avoid unresponsive script");
          _results.push(setTimeout(arguments.callee, 0));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    })();
    model_val = this.modelValues();
    if (model_val.length > 0) {
      i = 0;
      nodes = root.find('li');
      (function() {
        var j, node, _i, _ref, _ref1, _results;
        _results = [];
        for (j = _i = i, _ref = nodes.length - 1; _i <= _ref; j = _i += 1) {
          node = nodes[j];
          if (node == null) {
            break;
          }
          if (_ref1 = $(node).attr("node_value"), __indexOf.call(model_val, _ref1) >= 0) {
            $(node).attr('data-jstree', '{"selected":true, "opened":false}');
          }
          if (i < (items.length - 1) && (new Date().getTime() - start > 40)) {
            console.log("Tree initial value population yielding to browser to avoid unresponsive script");
            _results.push(setTimeout(arguments.callee, 0));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      })();
    }
    root.jstree({
      checkbox: {
        keep_selected_style: false,
        three_state: this.cascade
      },
      plugins: ["checkbox"]
    });
    this.tree_root = root;
    console.log("Completed building Tree control in " + (new Date().getTime() - start) / 1000 + " seconds");
    return result;
  };

  return Tree;

})(Typed);

module.exports = Tree;


},{"./base.coffee":8,"./treeitem.coffee":23,"./typed.coffee":24,"jquery":"usFOt+"}],23:[function(require,module,exports){
var $, TreeItem;

$ = require('jquery');

TreeItem = (function() {
  TreeItem.selector = 'item';

  TreeItem.prototype.inputTag = 'li';

  function TreeItem(ui, model, controlClasses, resolver, parent_path, separator) {
    var item;
    this.separator = separator;
    this.label = $(ui).attr('label');
    this.value = $(ui).attr('value');
    if (!((this.label != null) && this.label.length > 0)) {
      this.label = this.value;
    }
    if ((separator != null) && separator.length > 0) {
      this.value = parent_path + this.separator + this.value;
    }
    this.ui = ui;
    this.items = (function() {
      var _i, _len, _ref, _results;
      _ref = ui.children('item');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(new TreeItem($(item), model, controlClasses, resolver, this.value, this.separator));
      }
      return _results;
    }).call(this);
  }

  TreeItem.prototype.buildHelpDom = function() {
    var help, result, _i, _len, _ref;
    result = $('<span>', {
      "class": 'echoforms-help'
    });
    _ref = this.ui.children('help');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      help = _ref[_i];
      $('<p>', {
        "class": 'echoforms-help-item'
      }).text($(help).text()).attr({
        title: $(help).text()
      }).appendTo(result);
    }
    return result;
  };

  TreeItem.prototype.buildElementsDom = function() {
    var childlist, el, i, items;
    el = $('<li>');
    el.attr({
      node_value: this.value
    });
    el.text(this.label);
    el.append(this.buildHelpDom());
    childlist = $('<ul>');
    i = 0;
    items = this.items;
    (function() {
      var item, j, node, start, _i, _ref, _results;
      start = new Date().getTime();
      _results = [];
      for (j = _i = i, _ref = items.length - 1; _i <= _ref; j = _i += 1) {
        item = items[j];
        if (item == null) {
          break;
        }
        node = item.buildElementsDom();
        node.appendTo(childlist);
        if (i < (items.length - 1) && (new Date().getTime() - start > 40)) {
          console.log("TreeItem construction yielding to browser to avoid unresponsive script");
          _results.push(postMessage("script-timeout-message", "*"));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    })();
    if (this.items.length > 0) {
      childlist.appendTo(el);
    }
    return el;
  };

  return TreeItem;

})();

module.exports = TreeItem;


},{"jquery":"usFOt+"}],24:[function(require,module,exports){
var $, Base, TypeConstraint, Typed,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

$ = require('jquery');

Base = require('./base.coffee');

TypeConstraint = require('../constraints/type.coffee');

Typed = (function(_super) {
  __extends(Typed, _super);

  function Typed(ui, model, controlClasses, resolver) {
    var _ref;
    this.inputType = ((_ref = ui.attr('type')) != null ? _ref : 'string').replace(/^.*:/, '').toLowerCase();
    Typed.__super__.constructor.call(this, ui, model, controlClasses, resolver);
    this.inputs().bind('click change', this.onChange);
  }

  Typed.prototype.loadConstraints = function() {
    Typed.__super__.loadConstraints.call(this);
    return this.constraints.push(new TypeConstraint(this.inputType));
  };

  Typed.prototype.inputs = function() {
    return this._inputs != null ? this._inputs : this._inputs = this.el.find(':input');
  };

  Typed.prototype.inputValue = function() {
    return $.trim(this.inputs().val());
  };

  Typed.prototype.inputAttrs = function() {
    var _ref, _ref1;
    return {
      id: "" + this.id + "-element",
      "class": "echoforms-element-" + ((_ref = (_ref1 = this.inputElementType) != null ? _ref1 : this.inputClass) != null ? _ref : this.ui[0].nodeName),
      autocomplete: "off"
    };
  };

  Typed.prototype.saveToModel = function() {
    Typed.__super__.saveToModel.call(this);
    if (this.refExpr) {
      return this.ref().text(this.inputValue());
    }
  };

  Typed.prototype.loadFromModel = function() {
    Typed.__super__.loadFromModel.call(this);
    if (this.refExpr) {
      return this.inputs().val(this.refValue());
    }
  };

  Typed.prototype.buildDom = function() {
    return Typed.__super__.buildDom.call(this).addClass('echoforms-typed-control');
  };

  Typed.prototype.buildElementsDom = function() {
    return Typed.__super__.buildElementsDom.call(this).append($("<" + this.inputTag + ">", this.inputAttrs()));
  };

  return Typed;

})(Base);

module.exports = Typed;


},{"../constraints/type.coffee":6,"./base.coffee":8,"jquery":"usFOt+"}],25:[function(require,module,exports){
var Output, UrlOutput, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Output = require('./output.coffee');

UrlOutput = (function(_super) {
  __extends(UrlOutput, _super);

  function UrlOutput() {
    _ref = UrlOutput.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UrlOutput.selector = 'output[type$=anyURI], output[type$=anyuri]';

  UrlOutput.prototype.inputTag = 'a';

  UrlOutput.prototype.inputAttrs = function() {
    var attrs;
    attrs = UrlOutput.__super__.inputAttrs.call(this);
    attrs['href'] = '#';
    return attrs;
  };

  UrlOutput.prototype.loadFromModel = function() {
    var value;
    value = this.refValue();
    if (this.refExpr || this.valueExpr) {
      return this.el.find('.echoforms-elements > a').text(value).attr('href', value);
    }
  };

  return UrlOutput;

})(Output);

module.exports = UrlOutput;


},{"./output.coffee":16}],26:[function(require,module,exports){
var $, EchoForm, FormControl, controls, defaultControls, defaults, util;

$ = require('jquery');

util = require('./util.coffee');

controls = require('./controls/index.coffee');

FormControl = require('./controls/form.coffee');

defaultControls = controls.matchList.concat();

defaults = {
  controls: []
};

EchoForm = (function() {
  EchoForm.registerControl = function(controlClass, options) {
    if (options == null) {
      options = {};
    }
    return defaultControls.unshift(controlClass);
  };

  function EchoForm(root, options) {
    var controlClasses, doc, exception, form, model, resolver, ui;
    this.root = root;
    try {
      this.options = $.extend({}, defaults, options);
      this.form = form = this.options['form'];
      this.controlClasses = controlClasses = this.options['controls'].concat(defaultControls);
      if (form == null) {
        util.error("You must specify a 'form' option when creating a new ECHO Forms instance");
      }
      this.resolver = resolver = util.buildXPathResolverFn(form);
      this.doc = doc = $(util.parseXML(form));
      this.model = model = doc.find('form > model > instance');
      this.ui = ui = doc.find('form > ui');
      this.control = new FormControl(ui, model, controlClasses, resolver);
      this.root.append(this.control.element());
      this.control.addedToDom();
    } catch (_error) {
      exception = _error;
      util.error(exception);
      throw exception;
    }
  }

  EchoForm.prototype.destroy = function() {
    return this.root.empty();
  };

  EchoForm.prototype.isValid = function() {
    return this.control.isValid();
  };

  EchoForm.prototype.serialize = function(options) {
    return this.control.serialize(options);
  };

  return EchoForm;

})();

module.exports = EchoForm;


},{"./controls/form.coffee":11,"./controls/index.coffee":14,"./util.coffee":33,"jquery":"usFOt+"}],"browser":[function(require,module,exports){
module.exports=require('b9SDEC');
},{}],"b9SDEC":[function(require,module,exports){
(function(document, window) {
  return module.exports = {
    document: document,
    window: window
  };
})(document, window);


},{}],"jquery":[function(require,module,exports){
module.exports=require('usFOt+');
},{}],"usFOt+":[function(require,module,exports){
module.exports = jQuery;


},{}],31:[function(require,module,exports){
module.exports = require('./echoform.coffee');


},{"./echoform.coffee":26}],32:[function(require,module,exports){
var $, EchoForm, controls, pluginName, util,
  __slice = [].slice;

$ = require('jquery');

util = require('./util.coffee');

controls = require('./controls/index.coffee');

pluginName = require('./config.coffee').pluginName;

EchoForm = require('./echoform.coffee');

$[pluginName] = {
  control: function(controlClass, options) {
    if (options == null) {
      options = {};
    }
    EchoForm.registerControl(controlClass);
    if (options['export']) {
      $[pluginName]['controls'][controlClass.name] = controlClass;
    }
    return this;
  },
  controls: $.extend({}, controls.classes),
  extras: $.extend({}, controls.extras)
};

$.fn[pluginName] = function() {
  var args, method, result, _ref;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (args.length > 0 && typeof args[0] === 'string') {
    _ref = args, method = _ref[0], args = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
    result = this.map(function() {
      var attr, form, x, _ref1;
      form = $.data(this, pluginName);
      if (!form) {
        util.warn("" + pluginName + " not found on instance");
        return this;
      } else if (/^debug_/.test(method)) {
        _ref1 = method.split('_'), x = _ref1[0], attr = 2 <= _ref1.length ? __slice.call(_ref1, 1) : [];
        return form[attr.join('_')];
      } else if (method === 'destroy') {
        $.removeData(this, pluginName);
        if (typeof (form != null ? form.destroy : void 0) === 'function') {
          return form.destroy();
        }
      } else if (!/^_/.test(method) && typeof (form != null ? form[method] : void 0) === 'function') {
        return form[method].apply(form, args);
      } else {
        util.error("Could not call " + method + " on " + pluginName + " instance:", this);
        return null;
      }
    });
    return result[0];
  } else if (args.length < 2) {
    return this.each(function() {
      var options;
      options = args[0];
      if ($.data(this, pluginName) == null) {
        return $.data(this, pluginName, new EchoForm($(this), options));
      }
    });
  } else {
    util.error("Bad arguments to " + pluginName + ":", args);
    return this;
  }
};


},{"./config.coffee":1,"./controls/index.coffee":14,"./echoform.coffee":26,"./util.coffee":33,"jquery":"usFOt+"}],33:[function(require,module,exports){
var buildXPathResolverFn, error, execXPath, parseXML, printDOMToString, warn, wgxpathInstalled, window,
  __slice = [].slice;

window = require('browser').window;

wgxpathInstalled = false;

warn = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn.apply(console, args) : void 0 : void 0;
};

error = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (typeof console !== "undefined" && console !== null) {
    if (typeof console.error === "function") {
      console.error.apply(console, args);
    }
  }
  if ($("#form_load_errors") != null) {
    return $("#form_load_errors").append("<div class='form_load_error'>" + args + "</div>");
  }
};

execXPath = function(root, xpath, resolver) {
  var doc, result, val;
  if (!wgxpathInstalled) {
    if (typeof wgxpath !== "undefined" && wgxpath !== null) {
      if (typeof wgxpath.install === "function") {
        wgxpath.install(window);
      }
    }
  }
  wgxpathInstalled = true;
  if (root.length < 1) {
    error("Error processing xpath [" + xpath + "].  Provided context node was not valid. Verify that the ref attribute of the parent group is valid (including the namespace).");
  }
  if ((xpath != null ? xpath.charAt(0) : void 0) === '[') {
    xpath = "self::*" + xpath;
  }
  if (xpath === "true") {
    return true;
  }
  if (xpath === "false") {
    return false;
  }
  doc = root[0].ownerDocument;
  xpath = xpath.replace(/^\/+|(https:)?\/\//g, function($0, $1) {
    if ($1) {
      return $0;
    } else {
      return '/descendant-or-self::node()/';
    }
  });
  if (doc['evaluate'] == null) {
    wgxpath.install({
      document: doc
    });
  }
  result = doc.evaluate(xpath, root[0], resolver, XPathResult.ANY_TYPE, null);
  val = (function() {
    switch (result.resultType) {
      case XPathResult.NUMBER_TYPE:
        return result.numberValue;
      case XPathResult.STRING_TYPE:
        return result.stringValue;
      case XPathResult.BOOLEAN_TYPE:
        return result.booleanValue;
      default:
        return result.iterateNext();
    }
  })();
  return val;
};

parseXML = function(data) {
  var err, xml;
  if (!data || typeof data !== 'string') {
    return null;
  }
  xml = void 0;
  try {
    if (window.DOMParser) {
      xml = new DOMParser().parseFromString(data, 'text/xml');
    } else {
      xml = new ActiveXObject("Microsoft.XMLDOM");
      xml.async = "false";
      xml.loadXML(data);
    }
  } catch (_error) {
    err = _error;
  }
  if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
    error("Invalid XML: " + data);
  }
  return xml;
};

buildXPathResolverFn = function(xml) {
  var defaultName, match, name, namespaceRegexp, namespaces, uri, _ref;
  namespaces = {};
  defaultName = " default ";
  namespaceRegexp = /\sxmlns(?::(\w+))?=\"([^\"]+)\"/g;
  while ((match = namespaceRegexp.exec(xml)) != null) {
    _ref = match.slice(1, 3), name = _ref[0], uri = _ref[1];
    namespaces[name != null ? name : defaultName] = uri;
  }
  return function(prefix) {
    return namespaces[prefix != null ? prefix : defaultName];
  };
};

printDOMToString = function(dom_object, ns_map) {
  var attributes, output;
  if (ns_map == null) {
    ns_map = {};
  }
  output = "";
  attributes = "";
  if (dom_object.nodeName === "#text") {
    return "" + output + ($('<div/>').text(dom_object.nodeValue).html());
  } else if (dom_object.nodeName === "#comment") {
    return "" + output + "<!--" + dom_object.nodeValue + "-->";
  }
  for (var i=0; i < dom_object.attributes.length; i++){
            var name = dom_object.attributes[i].name;
            var value = dom_object.attributes[i].value;
            attributes += ' ' + name + '="' + value +'"';
            if (/xmlns/.test(name) && name != "xmlns"){
              ns_map[name.split(":").pop()] = value;
            }
        };
  if (dom_object.prefix == null) {
    for (prefix in ns_map){
        if (ns_map.hasOwnProperty(prefix)){
          if (ns_map[prefix] == dom_object.namespaceURI){
            dom_object.prefix = prefix;
            break;
          }
        }
      };
  }
  output += "<" + dom_object.nodeName;
  output += "" + attributes + ">";
  for (var i=0; i < dom_object.childNodes.length; i++){
            output += printDOMToString(dom_object.childNodes[i], ns_map);
        };
  return "" + output + "</" + dom_object.nodeName + ">";
};

module.exports = {
  warn: warn,
  error: error,
  execXPath: execXPath,
  parseXML: parseXML,
  buildXPathResolverFn: buildXPathResolverFn,
  printDOMToString: printDOMToString
};


},{"browser":"b9SDEC"}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,"b9SDEC","usFOt+",31,32,33])
;