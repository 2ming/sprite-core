'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _dec, _dec2, _desc, _value, _class, _class2, _temp;

var _attr12 = require('./attr');

var _attr13 = _interopRequireDefault(_attr12);

var _basenode = require('./basenode');

var _basenode2 = _interopRequireDefault(_basenode);

var _spriteMath = require('sprite-math');

var _animation = require('./animation');

var _animation2 = _interopRequireDefault(_animation);

var _spriteUtils = require('sprite-utils');

var _gradient = require('./gradient');

var _gradient2 = _interopRequireDefault(_gradient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _attr = (0, _symbol2.default)('attr'),
    _animations = (0, _symbol2.default)('animations'),
    _beforeRenders = (0, _symbol2.default)('beforeRenders'),
    _afterRenders = (0, _symbol2.default)('afterRenders');

var BaseSprite = (_dec = (0, _spriteUtils.deprecate)('BaseSprite#draw(fn, ...)', 'Instead use beforeDraw/afterDraw.'), _dec2 = (0, _spriteUtils.deprecate)('Instead use beforeDraw/afterDraw.'), (_class = (_temp = _class2 = function (_BaseNode) {
  (0, _inherits3.default)(BaseSprite, _BaseNode);

  /**
    new Sprite({
      attr: {
        ...
      }
    })
   */
  function BaseSprite(attr) {
    (0, _classCallCheck3.default)(this, BaseSprite);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BaseSprite.__proto__ || (0, _getPrototypeOf2.default)(BaseSprite)).call(this));

    _this[_attr] = new _this.constructor.Attr(_this);
    _this[_animations] = new _set2.default();
    _this[_beforeRenders] = [];
    _this[_afterRenders] = [];

    if (attr) {
      _this.attr(attr);
    }
    return _this;
  }

  (0, _createClass3.default)(BaseSprite, [{
    key: 'initAttributes',
    value: function initAttributes(attrs) {
      this[_attr].merge(attrs);
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      var nodeType = this.nodeType,
          attrs = this[_attr].serialize(),
          id = this.id;

      return {
        nodeType: nodeType,
        attrs: attrs,
        id: id
      };
    }
  }, {
    key: 'cloneNode',
    value: function cloneNode(copyContent) {
      var node = new this.constructor();
      if (copyContent) {
        node.initAttributes(this[_attr].serialize());
      }
      return node;
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(prop) {
      return this.attr(prop);
    }
  }, {
    key: 'setAttribute',
    value: function setAttribute(prop, val) {
      return this.attr(prop, val);
    }
  }, {
    key: 'removeAttribute',
    value: function removeAttribute(prop) {
      return this.attr(prop, null);
    }
  }, {
    key: 'attr',
    value: function attr(props, val) {
      if ((typeof props === 'undefined' ? 'undefined' : (0, _typeof3.default)(props)) === 'object') {
        (0, _assign2.default)(this[_attr], props);
        return this;
      } else if (typeof props === 'string') {
        if (val !== undefined) {
          (0, _assign2.default)(this[_attr], (0, _defineProperty3.default)({}, props, val));
          return this;
        }
        var attrs = this[_attr].attrs;
        return attrs[props];
      }

      return this[_attr].attrs;
    }
  }, {
    key: 'attrs',
    value: function attrs() {
      return this[_attr].attrs;
    }
  }, {
    key: 'animate',
    value: function animate(frames, timing) {
      var _this2 = this;

      var animation = new _animation2.default(this, frames, timing);
      if (this.layer) {
        animation.baseTimeline = this.layer.timeline;
        animation.play();
        animation.finished.then(function () {
          _this2[_animations].delete(animation);
        });
      }
      this[_animations].add(animation);
      return animation;
    }
  }, {
    key: 'connect',
    value: function connect(parent) {
      var _this3 = this;

      var zOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (parent && !(parent instanceof _basenode2.default)) {
        var node = new _basenode2.default();
        node.context = parent;
        parent = node;
      }
      var ret = (0, _get3.default)(BaseSprite.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseSprite.prototype), 'connect', this).call(this, parent, zOrder);
      Object.defineProperty(this, 'context', {
        get: function get() {
          return parent.cache || parent.context;
        },
        configurable: true
      });
      this[_animations].forEach(function (animation) {
        animation.baseTimeline = parent.timeline;
        animation.play();
        animation.finished.then(function () {
          _this3[_animations].delete(animation);
        });
      });
      return ret;
    }
  }, {
    key: 'disconnect',
    value: function disconnect(parent) {
      this[_animations].forEach(function (animation) {
        return animation.cancel();
      });
      var ret = (0, _get3.default)(BaseSprite.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseSprite.prototype), 'disconnect', this).call(this, parent);
      delete this.context;
      return ret;
    }

    // content width / height

  }, {
    key: 'OBBCollision',


    // OBB: http://blog.csdn.net/silangquan/article/details/50812425
    value: function OBBCollision(sprite) {
      // vertices: [p1, p2, p3, p4]
      var _vertices = (0, _slicedToArray3.default)(this.vertices, 3),
          p11 = _vertices[0],
          p12 = _vertices[1],
          p13 = _vertices[2],
          _sprite$vertices = (0, _slicedToArray3.default)(sprite.vertices, 3),
          p21 = _sprite$vertices[0],
          p22 = _sprite$vertices[1],
          p23 = _sprite$vertices[2];

      var a1 = new _spriteMath.Vector(p12, p11).unit(),
          a2 = new _spriteMath.Vector(p13, p12).unit(),
          a3 = new _spriteMath.Vector(p22, p21).unit(),
          a4 = new _spriteMath.Vector(p23, p22).unit();

      // The projection of the axis of a vertex in a certain direction
      function verticesProjection(vertices, axis) {
        var _vertices$map = vertices.map(function (v) {
          return axis.dot(new _spriteMath.Vector(v));
        }),
            _vertices$map2 = (0, _slicedToArray3.default)(_vertices$map, 4),
            p1 = _vertices$map2[0],
            p2 = _vertices$map2[1],
            p3 = _vertices$map2[2],
            p4 = _vertices$map2[3];

        return [Math.min(p1, p2, p3, p4), Math.max(p1, p2, p3, p4)];
      }

      function projectionIntersect(p1, p2) {
        var m1 = (p1[0] + p1[1]) / 2,
            l1 = Math.abs(p1[1] - p1[0]),
            m2 = (p2[0] + p2[1]) / 2,
            l2 = Math.abs(p2[1] - p2[0]);

        return Math.abs(m2 - m1) <= (l1 + l2) / 2;
      }

      return projectionIntersect(verticesProjection(this.vertices, a1), verticesProjection(sprite.vertices, a1)) && projectionIntersect(verticesProjection(this.vertices, a2), verticesProjection(sprite.vertices, a2)) && projectionIntersect(verticesProjection(this.vertices, a3), verticesProjection(sprite.vertices, a3)) && projectionIntersect(verticesProjection(this.vertices, a4), verticesProjection(sprite.vertices, a4));
    }
  }, {
    key: 'remove',
    value: function remove() {
      if (!this.parent) return false;
      this.parent.removeChild(this);
      return true;
    }
  }, {
    key: 'appendTo',
    value: function appendTo(parent) {
      parent.appendChild(this);
    }
  }, {
    key: 'forceUpdate',
    value: function forceUpdate() {
      var clearCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var parent = this.parent;
      if (parent) {
        if (parent.forceUpdate) {
          parent.forceUpdate(true);
        } else if (parent.update) {
          if (clearCache) {
            this.cache = null;
          }
          this.parent.update(this);
        }
      }
    }

    // layer position to sprite offset

  }, {
    key: 'pointToOffset',
    value: function pointToOffset(x, y) {
      var attr = this.attr();
      var dx = x - attr.x,
          dy = y - attr.y;

      var transform = this.transform;
      return transform.inverse().transformPoint(dx, dy);
    }
  }, {
    key: 'pointCollision',
    value: function pointCollision(evt) {
      var parentX = void 0,
          parentY = void 0;

      if (evt.parentX != null) {
        // group
        parentX = evt.parentX;
        parentY = evt.parentY;
      } else {
        parentX = evt.layerX;
        parentY = evt.layerY;
      }

      var _renderRect = (0, _slicedToArray3.default)(this.renderRect, 4),
          x = _renderRect[0],
          y = _renderRect[1],
          w = _renderRect[2],
          h = _renderRect[3];

      if (parentX >= x && parentX - x < w && parentY >= y && parentY - y < h) {
        var _originRect = (0, _slicedToArray3.default)(this.originRect, 4),
            ox = _originRect[0],
            oy = _originRect[1],
            ow = _originRect[2],
            oh = _originRect[3];

        var _pointToOffset = this.pointToOffset(parentX, parentY),
            _pointToOffset2 = (0, _slicedToArray3.default)(_pointToOffset, 2),
            nx = _pointToOffset2[0],
            ny = _pointToOffset2[1];

        if (nx >= ox && nx - ox < ow && ny >= oy && ny - oy < oh) {
          evt.offsetX = nx;
          evt.offsetY = ny;

          return true;
        }
      }
    }
  }, {
    key: 'draw',
    value: function draw(t) {
      if (typeof t === 'function') {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this._draw.apply(this, [t].concat(args));
      }

      var drawingContext = this.context;
      if (!drawingContext) {
        throw new Error('No context!');
      }

      var context = drawingContext;

      var transform = this.transform.m,
          pos = this.attr('pos'),
          bound = this.originRect;

      drawingContext.save();
      drawingContext.translate(pos[0], pos[1]);
      drawingContext.transform.apply(drawingContext, (0, _toConsumableArray3.default)(transform));
      drawingContext.globalAlpha = this.attr('opacity');

      if (drawingContext.canvas && drawingContext.canvas.cloneNode) {
        context = this.cache;
        if (!context) {
          var cacheCanvas = drawingContext.canvas.cloneNode(false);
          cacheCanvas.width = bound[2];
          cacheCanvas.height = bound[3];
          context = cacheCanvas.getContext('2d');
        }
      } else {
        context.translate(bound[0], bound[1]);
      }

      if (context === drawingContext) {
        var _offsetSize = (0, _slicedToArray3.default)(this.offsetSize, 2),
            w = _offsetSize[0],
            h = _offsetSize[1];

        context.save();
        context.beginPath();
        context.rect(0, 0, w, h);
        context.clip();
        context.closePath();
      }
      if (this[_beforeRenders].length) {
        this.userRender(t, context, 'before');
      }
      if (context !== this.cache) {
        context = this.render(t, context);
        if (context !== drawingContext) this.cache = context;
      }
      if (this[_afterRenders].length) {
        this.userRender(t, context, 'after');
      }
      if (context === drawingContext) {
        context.restore();
      }

      if (context !== drawingContext) {
        drawingContext.drawImage(context.canvas, bound[0], bound[1]);
      }
      drawingContext.restore();

      var updateHandlers = this.getEventHandlers('update');
      if (updateHandlers.length) {
        this.dispatchEvent('update', {
          target: this, context: context, renderBox: this.renderBox, lastRenderBox: this.lastRenderBox
        }, true);
      }
      this.lastRenderBox = this.renderBox;

      return drawingContext;
    }
  }, {
    key: '_draw',
    value: function _draw(fn) {
      var clearCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var remove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this.drawAfter(fn, clearCache, remove);
    }
  }, {
    key: 'drawOnce',
    value: function drawOnce(fn) {
      this._draw(fn, true, true);
    }
  }, {
    key: 'drawBefore',
    value: function drawBefore(fn) {
      var clearCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var remove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this[_beforeRenders].push({ fn: fn, clearCache: clearCache, remove: remove });
      this.forceUpdate();
    }
  }, {
    key: 'drawAfter',
    value: function drawAfter(fn) {
      var clearCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var remove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this[_afterRenders].push({ fn: fn, clearCache: clearCache, remove: remove });
      this.forceUpdate();
    }

    // call by layer

  }, {
    key: 'userRender',
    value: function userRender(t, context, type) {
      var handlers = type;
      if (type === 'before') handlers = this[_beforeRenders];
      if (type === 'after') handlers = this[_afterRenders];
      var renderers = [];
      for (var i = 0; i < handlers.length; i++) {
        var renderer = handlers[i];
        var fn = renderer.fn,
            remove = renderer.remove,
            clearCache = renderer.clearCache;
        /* eslint-disable no-await-in-loop */

        fn.call(this, context, t, renderer);
        /* eslint-enable no-await-in-loop */
        if (!remove) {
          renderers.push(renderer);
        }
        if (clearCache) {
          this.cache = null;
        }
      }
      if (type === 'before') {
        this[_beforeRenders] = renderers;
      }
      if (type === 'after') {
        this[_afterRenders] = renderers;
      }
      return renderers;
    }
  }, {
    key: 'render',
    value: function render(t, drawingContext) {
      var attr = this.attr(),
          bgcolor = attr.bgcolor,
          gradients = attr.gradients,
          _offsetSize2 = (0, _slicedToArray3.default)(this.offsetSize, 2),
          offsetWidth = _offsetSize2[0],
          offsetHeight = _offsetSize2[1],
          _clientSize = (0, _slicedToArray3.default)(this.clientSize, 2),
          clientWidth = _clientSize[0],
          clientHeight = _clientSize[1];


      if (offsetWidth === 0 || offsetHeight === 0) {
        return drawingContext; // don't need to render
      }

      var _attr$border = (0, _slicedToArray3.default)(attr.border, 2),
          borderWidth = _attr$border[0],
          borderColor = _attr$border[1];

      var borderRadius = attr.borderRadius;

      drawingContext.save();

      // draw border
      if (borderWidth || gradients && gradients.border) {
        drawingContext.lineWidth = borderWidth;

        var x = borderWidth / 2,
            y = borderWidth / 2,
            w = offsetWidth - borderWidth,
            h = offsetHeight - borderWidth,
            r = borderRadius;


        drawingContext.beginPath();
        drawingContext.moveTo(x + r, y);
        drawingContext.arcTo(x + w, y, x + w, y + h, r);
        drawingContext.arcTo(x + w, y + h, x, y + h, r);
        drawingContext.arcTo(x, y + h, x, y, r);
        drawingContext.arcTo(x, y, x + w, y, r);
        drawingContext.closePath();

        if (gradients && gradients.border) {
          var rect = gradients.border.rect || [x, y, w, h];

          drawingContext.strokeStyle = (0, _gradient2.default)(drawingContext, rect, gradients.border);
        } else if (borderColor) {
          drawingContext.strokeStyle = borderColor;
        }

        drawingContext.stroke();
        drawingContext.clip();
      }

      // draw bgcolor
      if (bgcolor || gradients && gradients.bgcolor) {
        var _ref = [borderWidth, borderWidth, clientWidth, clientHeight, Math.max(0, borderRadius - borderWidth / 2)],
            _x9 = _ref[0],
            _y = _ref[1],
            _w = _ref[2],
            _h = _ref[3],
            _r = _ref[4];


        drawingContext.beginPath();
        drawingContext.moveTo(_x9 + _r, _y);
        drawingContext.arcTo(_x9 + _w, _y, _x9 + _w, _y + _h, _r);
        drawingContext.arcTo(_x9 + _w, _y + _h, _x9, _y + _h, _r);
        drawingContext.arcTo(_x9, _y + _h, _x9, _y, _r);
        drawingContext.arcTo(_x9, _y, _x9 + _w, _y, _r);
        drawingContext.closePath();

        if (gradients && gradients.bgcolor) {
          var _rect = gradients.bgcolor.rect || [_x9, _y, _w, _h];

          drawingContext.fillStyle = (0, _gradient2.default)(drawingContext, _rect, gradients.bgcolor);
        } else if (bgcolor) {
          drawingContext.fillStyle = bgcolor;
        }

        drawingContext.fill();
      }

      drawingContext.restore();

      var padding = attr.padding,
          paddingTop = padding[0],
          paddingLeft = padding[3];

      drawingContext.translate(paddingLeft, paddingTop);

      return drawingContext;
    }
  }, {
    key: 'nodeType',
    get: function get() {
      return this.constructor.nodeType;
    }
  }, {
    key: 'layer',
    get: function get() {
      var node = this;
      do {
        node = node.parent;
      } while (node != null && !node.drawSprites);
      return node;
    }
  }, {
    key: 'id',
    set: function set(val) {
      this.attr('id', val);
    },
    get: function get() {
      return this.attr('id');
    }
  }, {
    key: 'name',
    set: function set(val) {
      this.attr('name', val);
    },
    get: function get() {
      return this.attr('name');
    }
  }, {
    key: 'transform',
    get: function get() {
      return new _spriteMath.Matrix(this[_attr].get('transformMatrix'));
    }
  }, {
    key: 'contentSize',
    get: function get() {
      var _attr2 = this.attr('size'),
          _attr3 = (0, _slicedToArray3.default)(_attr2, 2),
          width = _attr3[0],
          height = _attr3[1];

      return [width | 0, height | 0];
    }

    // content + padding

  }, {
    key: 'clientSize',
    get: function get() {
      var _attr4 = this.attr('padding'),
          _attr5 = (0, _slicedToArray3.default)(_attr4, 4),
          top = _attr5[0],
          right = _attr5[1],
          bottom = _attr5[2],
          left = _attr5[3],
          _contentSize = (0, _slicedToArray3.default)(this.contentSize, 2),
          width = _contentSize[0],
          height = _contentSize[1];

      return [left + width + right, top + height + bottom];
    }

    // content + padding + border

  }, {
    key: 'offsetSize',
    get: function get() {
      var _attr6 = this.attr('border'),
          _attr7 = (0, _slicedToArray3.default)(_attr6, 1),
          borderWidth = _attr7[0],
          _clientSize2 = (0, _slicedToArray3.default)(this.clientSize, 2),
          width = _clientSize2[0],
          height = _clientSize2[1];

      return [width + 2 * borderWidth, height + 2 * borderWidth];
    }
  }, {
    key: 'innerSize',
    get: function get() {
      return this.contentSize;
    }
  }, {
    key: 'outerSize',
    get: function get() {
      return this.offsetSize;
    }
  }, {
    key: 'boundRect',
    get: function get() {
      var anchor = this.attr('anchor'),
          transform = this.transform;

      var _offsetSize3 = (0, _slicedToArray3.default)(this.offsetSize, 2),
          width = _offsetSize3[0],
          height = _offsetSize3[1];

      var _anchor = (0, _slicedToArray3.default)(anchor, 2),
          anchorX = _anchor[0],
          anchorY = _anchor[1];

      var vertexs = [[-anchorX * width, -anchorY * height], [(1 - anchorX) * width, -anchorY * height], [-anchorX * width, (1 - anchorY) * height], [(1 - anchorX) * width, (1 - anchorY) * height]];

      var transformed = vertexs.map(function (v) {
        return transform.transformPoint(v[0], v[1]);
      });
      var vx = transformed.map(function (v) {
        return v[0];
      }),
          vy = transformed.map(function (v) {
        return v[1];
      });

      var minX = Math.min.apply(Math, (0, _toConsumableArray3.default)(vx)),
          minY = Math.min.apply(Math, (0, _toConsumableArray3.default)(vy)),
          maxX = Math.max.apply(Math, (0, _toConsumableArray3.default)(vx)),
          maxY = Math.max.apply(Math, (0, _toConsumableArray3.default)(vy));

      return [].concat((0, _toConsumableArray3.default)([minX, minY].map(Math.floor)), (0, _toConsumableArray3.default)([maxX - minX, maxY - minY].map(Math.ceil)));
    }

    // rect before transform

  }, {
    key: 'originRect',
    get: function get() {
      var _offsetSize4 = (0, _slicedToArray3.default)(this.offsetSize, 2),
          width = _offsetSize4[0],
          height = _offsetSize4[1],
          _attr8 = this.attr('anchor'),
          _attr9 = (0, _slicedToArray3.default)(_attr8, 2),
          anchorX = _attr9[0],
          anchorY = _attr9[1];

      return [Math.floor(-anchorX * width), Math.floor(-anchorY * height), width, height];
    }
  }, {
    key: 'originRenderRect',
    get: function get() {
      var bound = this.originRect,
          pos = this.attr('pos');

      return [pos[0] + bound[0], pos[1] + bound[1], bound[2], bound[3]];
    }
  }, {
    key: 'renderBox',
    get: function get() {
      var bound = this.boundRect,
          pos = this.attr('pos');

      return [pos[0] + bound[0] - 1, pos[1] + bound[1] - 1, pos[0] + bound[0] + bound[2] + 1, pos[1] + bound[1] + bound[3] + 1];
    }
  }, {
    key: 'renderRect',
    get: function get() {
      var bound = this.boundRect,
          pos = this.attr('pos');

      return [pos[0] + bound[0], pos[1] + bound[1], bound[2], bound[3]];
    }
  }, {
    key: 'vertices',
    get: function get() {
      var vertices = (0, _spriteUtils.rectVertices)(this.originRect),
          transform = this.transform,
          _attr10 = this.attr('pos'),
          _attr11 = (0, _slicedToArray3.default)(_attr10, 2),
          x0 = _attr11[0],
          y0 = _attr11[1];


      return vertices.map(function (v) {
        var _transform$transformP = transform.transformPoint(v[0], v[1]),
            _transform$transformP2 = (0, _slicedToArray3.default)(_transform$transformP, 2),
            x = _transform$transformP2[0],
            y = _transform$transformP2[1];

        return [Math.round(x0 + x), Math.round(y0 + y)];
      });
    }
  }, {
    key: 'cache',
    set: function set(context) {
      this.cacheContext = context;
    },
    get: function get() {
      return this.cacheContext;
    }
  }]);
  return BaseSprite;
}(_basenode2.default), _class2.Attr = _attr13.default, _temp), (_applyDecoratedDescriptor(_class.prototype, '_draw', [_dec], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, '_draw'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'drawOnce', [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'drawOnce'), _class.prototype)), _class));
exports.default = BaseSprite;