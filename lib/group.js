'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _set2 = require('babel-runtime/helpers/set');

var _set3 = _interopRequireDefault(_set2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _desc, _value, _class, _class2, _temp;

var _basesprite = require('./basesprite');

var _basesprite2 = _interopRequireDefault(_basesprite);

var _nodetype = require('./nodetype');

var _spriteUtils = require('sprite-utils');

var _path = require('./helpers/path');

var _layout = require('./layout');

var layout = _interopRequireWildcard(_layout);

var _group = require('./helpers/group');

var _group2 = _interopRequireDefault(_group);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _applyDecoratedDescriptor = require('babel-decorators-runtime');

var _children = (0, _symbol2.default)('children'),
    _zOrder = (0, _symbol2.default)('zOrder'),
    _layoutTag = (0, _symbol2.default)('layoutTag');

var GroupAttr = (_class = function (_BaseSprite$Attr) {
  (0, _inherits3.default)(GroupAttr, _BaseSprite$Attr);

  function GroupAttr(subject) {
    (0, _classCallCheck3.default)(this, GroupAttr);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GroupAttr.__proto__ || (0, _getPrototypeOf2.default)(GroupAttr)).call(this, subject));

    _this.setDefault({
      clip: null,
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap',
      alignContent: 'stretch'
    });
    return _this;
  }

  (0, _createClass3.default)(GroupAttr, [{
    key: 'clip',
    set: function set(val) {
      this.clearCache();
      if (val) {
        val = typeof val === 'string' ? { d: val } : val;
        this.subject.svg = (0, _path.createSvgPath)(val);
        this.set('clip', val);
      } else {
        this.subject.svg = null;
        this.set('clip', null);
      }
    }

    // flexbox attributes

  }, {
    key: 'flexDirection',
    set: function set(value) {
      this.clearCache();
      this.subject.clearLayout();
      this.set('flexDirection', value);
    }
  }, {
    key: 'flexWrap',
    set: function set(value) {
      this.clearCache();
      this.subject.clearLayout();
      this.set('flexWrap', value);
    }
  }, {
    key: 'justifyContent',
    set: function set(value) {
      this.clearCache();
      this.subject.clearLayout();
      this.set('justifyContent', value);
    }
  }, {
    key: 'alignItems',
    set: function set(value) {
      this.clearCache();
      this.subject.clearLayout();
      this.set('alignItems', value);
    }
  }, {
    key: 'alignContent',
    set: function set(value) {
      this.clearCache();
      this.subject.clearLayout();
      this.set('alignContent', value);
    }
  }, {
    key: 'width',
    set: function set(value) {
      this.subject.clearLayout();
      (0, _set3.default)(GroupAttr.prototype.__proto__ || (0, _getPrototypeOf2.default)(GroupAttr.prototype), 'width', value, this);
    }
  }, {
    key: 'height',
    set: function set(value) {
      this.subject.clearLayout();
      (0, _set3.default)(GroupAttr.prototype.__proto__ || (0, _getPrototypeOf2.default)(GroupAttr.prototype), 'height', value, this);
    }
  }, {
    key: 'layoutWidth',
    set: function set(value) {
      this.subject.clearLayout();
      (0, _set3.default)(GroupAttr.prototype.__proto__ || (0, _getPrototypeOf2.default)(GroupAttr.prototype), 'layoutWidth', value, this);
    }
  }, {
    key: 'layoutHeight',
    set: function set(value) {
      this.subject.clearLayout();
      (0, _set3.default)(GroupAttr.prototype.__proto__ || (0, _getPrototypeOf2.default)(GroupAttr.prototype), 'layoutHeight', value, this);
    }
  }, {
    key: 'display',
    set: function set(value) {
      this.subject.clearLayout();
      (0, _set3.default)(GroupAttr.prototype.__proto__ || (0, _getPrototypeOf2.default)(GroupAttr.prototype), 'display', value, this);
    }
  }]);
  return GroupAttr;
}(_basesprite2.default.Attr), (_applyDecoratedDescriptor(_class.prototype, 'clip', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'clip'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'flexDirection', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'flexDirection'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'flexWrap', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'flexWrap'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'justifyContent', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'justifyContent'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'alignItems', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'alignItems'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'alignContent', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'alignContent'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'width', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'width'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'height', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'height'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'layoutWidth', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'layoutWidth'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'layoutHeight', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'layoutHeight'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'display', [_spriteUtils.attr], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'display'), _class.prototype)), _class);
var Group = (_temp = _class2 = function (_BaseSprite) {
  (0, _inherits3.default)(Group, _BaseSprite);

  function Group() {
    var attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Group);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (Group.__proto__ || (0, _getPrototypeOf2.default)(Group)).call(this, attr));

    _this2[_children] = [];
    _this2[_zOrder] = 0;
    _this2[_layoutTag] = false;
    return _this2;
  }

  (0, _createClass3.default)(Group, [{
    key: 'cloneNode',
    value: function cloneNode(deepCopy) {
      var node = (0, _get3.default)(Group.prototype.__proto__ || (0, _getPrototypeOf2.default)(Group.prototype), 'cloneNode', this).call(this);
      if (deepCopy) {
        var children = this.children;
        children.forEach(function (child) {
          var subNode = child.cloneNode(deepCopy);
          node.append(subNode);
        });
      }
      return node;
    }
  }, {
    key: 'update',
    value: function update(child) {
      child.isDirty = true;
      this.forceUpdate(true);
    }
  }, {
    key: 'pointCollision',
    value: function pointCollision(evt) {
      if ((0, _get3.default)(Group.prototype.__proto__ || (0, _getPrototypeOf2.default)(Group.prototype), 'pointCollision', this).call(this, evt) || this.isVirtual) {
        if (this.svg) {
          var offsetX = evt.offsetX,
              offsetY = evt.offsetY;

          var rect = this.originalRect;
          evt.isInClip = this.svg.isPointInPath(offsetX - rect[0], offsetY - rect[1]);
        }
        return true;
      }
      return false;
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(type, evt) {
      var collisionState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var swallow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (swallow && this.getEventHandlers(type).length === 0) {
        return;
      }
      if (!swallow && !evt.terminated && type !== 'mouseenter' && type !== 'mouseleave') {
        var isCollision = collisionState || this.pointCollision(evt);
        if (isCollision) {
          var parentX = evt.offsetX - this.originalRect[0];
          var parentY = evt.offsetY - this.originalRect[1];
          // console.log(evt.parentX, evt.parentY)

          var _evt = (0, _assign2.default)({}, evt);
          _evt.parentX = parentX;
          _evt.parentY = parentY;

          var sprites = this[_children].slice(0).reverse();

          var targetSprites = [];

          for (var i = 0; i < sprites.length && evt.isInClip !== false; i++) {
            var sprite = sprites[i];
            var hit = sprite.dispatchEvent(type, _evt, collisionState, swallow);
            if (hit) {
              targetSprites.push(sprite);
            }
            if (evt.terminated && !type.startsWith('mouse')) {
              break;
            }
          }

          evt.targetSprites = targetSprites;
          // stopDispatch can only terminate event in the same level
          evt.terminated = false;
          return (0, _get3.default)(Group.prototype.__proto__ || (0, _getPrototypeOf2.default)(Group.prototype), 'dispatchEvent', this).call(this, type, evt, isCollision, swallow);
        }
      }
      evt.targetSprites = evt.targetSprites || [];
      return (0, _get3.default)(Group.prototype.__proto__ || (0, _getPrototypeOf2.default)(Group.prototype), 'dispatchEvent', this).call(this, type, evt, collisionState, swallow);
    }
  }, {
    key: 'relayout',
    value: function relayout() {
      var items = this.children.filter(function (child) {
        if (child.hasLayout) {
          child.attr('layoutWidth', null);
          child.attr('layoutHeight', null);
        }
        if (child.relayout) {
          var _display = child.attr('display');
          if (_display !== '' && _display !== 'static') {
            child.relayout();
          }
        }
        return child.hasLayout;
      });

      var display = this.attr('display');
      var doLayout = layout[display + 'Layout'];
      if (doLayout) {
        doLayout(this, items);
      }
    }
  }, {
    key: 'clearLayout',
    value: function clearLayout() {
      this[_layoutTag] = false;
      var parent = this.parent;
      while (parent) {
        if (parent[_layoutTag]) parent[_layoutTag] = false;
        parent = parent.parent;
      }
    }
  }, {
    key: 'render',
    value: function render(t, drawingContext) {
      if (this.attr('display') === 'flex' && !this[_layoutTag]) {
        this.relayout();
      }

      var clipPath = this.attr('clip');
      if (clipPath) {
        this.svg.beginPath().to(drawingContext);
        drawingContext.clip();
      }

      if (!this.isVirtual) {
        (0, _get3.default)(Group.prototype.__proto__ || (0, _getPrototypeOf2.default)(Group.prototype), 'render', this).call(this, t, drawingContext);

        var _attrSize = (0, _slicedToArray3.default)(this.attrSize, 2),
            w = _attrSize[0],
            h = _attrSize[1];

        if (w !== '' || h !== '') {
          drawingContext.beginPath();
          drawingContext.rect(0, 0, this.contentSize[0], this.contentSize[1]);
          drawingContext.clip();
        }
      }

      var sprites = this[_children];

      for (var i = 0; i < sprites.length; i++) {
        var child = sprites[i],
            isDirty = child.isDirty;
        child.isDirty = false;

        if (child.isVisible()) {
          child.draw(t, drawingContext);
        }
        if (isDirty) {
          child.dispatchEvent('update', { target: child, renderTime: t }, true, true);
        }
      }
      if (this.attr('display') === 'flex') {
        this[_layoutTag] = true;
      }
    }
  }, {
    key: 'isVirtual',
    get: function get() {
      if (this.attr('display') === 'flex') return false;

      var _attr = this.attr('border'),
          borderWidth = _attr.width,
          borderRadius = this.attr('borderRadius'),
          bgcolor = this.attr('bgcolor'),
          _attr2 = this.attr('gradients'),
          bgGradient = _attr2.bgcolor,
          _attrSize2 = (0, _slicedToArray3.default)(this.attrSize, 2),
          width = _attrSize2[0],
          height = _attrSize2[1],
          _attr3 = this.attr('anchor'),
          _attr4 = (0, _slicedToArray3.default)(_attr3, 2),
          anchorX = _attr4[0],
          anchorY = _attr4[1];

      return !anchorX && !anchorY && !width && !height && !borderRadius && !borderWidth && !bgcolor && !bgGradient;
    }
  }, {
    key: 'children',
    get: function get() {
      return this[_children];
    }
  }, {
    key: 'contentSize',
    get: function get() {
      if (this.isVirtual) return [0, 0];

      var _attrSize3 = (0, _slicedToArray3.default)(this.attrSize, 2),
          width = _attrSize3[0],
          height = _attrSize3[1];

      if (width === '' || height === '') {
        if (this.attr('clip')) {
          var svg = this.svg;
          var bounds = svg.bounds;
          width = width || bounds[2];
          height = height || bounds[3];
        } else {
          var right = void 0,
              bottom = void 0;

          right = 0;
          bottom = 0;
          this[_children].forEach(function (sprite) {
            var renderBox = sprite.renderBox;
            right = Math.max(right, renderBox[2]);
            bottom = Math.max(bottom, renderBox[3]);
          });
          width = width || right;
          height = height || bottom;
        }
      }
      return [width, height];
    }
  }]);
  return Group;
}(_basesprite2.default), _class2.Attr = GroupAttr, _temp);
exports.default = Group;

(0, _assign2.default)(Group.prototype, _group2.default);

(0, _nodetype.registerNodeType)('group', Group, true);