'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _defineProperty2 = require('babel-runtime/core-js/object/define-property');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty4 = require('babel-runtime/helpers/defineProperty');

var _defineProperty5 = _interopRequireDefault(_defineProperty4);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

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

var _class, _temp;

var _attr13 = require('./attr');

var _attr14 = _interopRequireDefault(_attr13);

var _basenode = require('./basenode');

var _basenode2 = _interopRequireDefault(_basenode);

var _spriteMath = require('sprite-math');

var _animation = require('./animation');

var _animation2 = _interopRequireDefault(_animation);

var _spriteUtils = require('sprite-utils');

var _nodetype = require('./nodetype');

var _render = require('./helpers/render');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _attr = (0, _symbol2.default)('attr'),
    _animations = (0, _symbol2.default)('animations'),
    _cachePriority = (0, _symbol2.default)('cachePriority');

var BaseSprite = (_temp = _class = function (_BaseNode) {
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
    _this[_cachePriority] = 0;
    _this.__cachePolicyThreshold = 6;

    if (attr) {
      _this.attr(attr);
    }
    return _this;
  }

  (0, _createClass3.default)(BaseSprite, [{
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
    key: 'merge',
    value: function merge(attrs) {
      this[_attr].merge(attrs);
    }
  }, {
    key: 'cloneNode',
    value: function cloneNode() {
      var node = new this.constructor();
      node.merge(this[_attr].serialize());
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
      var _this2 = this;

      if ((typeof props === 'undefined' ? 'undefined' : (0, _typeof3.default)(props)) === 'object') {
        (0, _entries2.default)(props).forEach(function (_ref) {
          var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
              prop = _ref2[0],
              value = _ref2[1];

          _this2.attr(prop, value);
        });
        return this;
      } else if (typeof props === 'string') {
        if (val !== undefined) {
          if (typeof val === 'function') {
            val = val(this[_attr][props]);
          }
          (0, _assign2.default)(this[_attr], (0, _defineProperty5.default)({}, props, val));
          if (props === 'zIndex' && this.parent) {
            this.parent.children.sort(function (a, b) {
              if (a.zIndex === b.zIndex) {
                return a.zOrder - b.zOrder;
              }
              return a.zIndex - b.zIndex;
            });
          }
          return this;
        }
        return this[_attr][props];
      }

      return this[_attr].attrs;
    }
  }, {
    key: 'attrs',
    value: function attrs() {
      return this.attr();
    }
  }, {
    key: 'isVisible',
    value: function isVisible() {
      var opacity = this.attr('opacity');
      if (opacity <= 0) {
        return false;
      }

      var _offsetSize = (0, _slicedToArray3.default)(this.offsetSize, 2),
          width = _offsetSize[0],
          height = _offsetSize[1];

      if (width <= 0 || height <= 0) {
        return false;
      }

      return true;
    }
  }, {
    key: 'transition',
    value: function transition(sec) {
      var easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'linear';

      var that = this;
      return {
        attr: function attr(prop, val) {
          if (typeof prop === 'string') {
            prop = (0, _defineProperty5.default)({}, prop, val);
          }
          (0, _entries2.default)(prop).forEach(function (_ref3) {
            var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
                key = _ref4[0],
                value = _ref4[1];

            if (typeof value === 'function') {
              prop[key] = value(that.attr(key));
            }
          });
          var anim = that.animate([prop], {
            duration: sec * 1000,
            fill: 'forwards',
            easing: easing
          });
          return anim.finished;
        }
      };
    }
  }, {
    key: 'animate',
    value: function animate(frames, timing) {
      var _this3 = this;

      var animation = new _animation2.default(this, frames, timing);
      if (this.layer) {
        animation.baseTimeline = this.layer.timeline;
        animation.play();
        animation.finished.then(function () {
          _this3[_animations].delete(animation);
        });
      }
      this[_animations].add(animation);
      return animation;
    }
  }, {
    key: 'connect',
    value: function connect(parent) {
      var _this4 = this;

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
        if (parent.layer) {
          animation.baseTimeline = parent.layer.timeline;
        }
        animation.play();
        animation.finished.then(function () {
          _this4[_animations].delete(animation);
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
      if (this.cache) {
        _render.cacheContextPool.put(this.cache);
      }
      var ret = (0, _get3.default)(BaseSprite.prototype.__proto__ || (0, _getPrototypeOf2.default)(BaseSprite.prototype), 'disconnect', this).call(this, parent);
      delete this.context;
      return ret;
    }

    // content width / height

  }, {
    key: 'clearCache',
    value: function clearCache() {
      this[_cachePriority] = 0;
      this.cache = null;
      if (this.parent && this.parent.cache) {
        this.parent[_cachePriority] = 0;
        this.parent.cache = null;
      }
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

      this.isDirty = true;
      if (clearCache) {
        this.clearCache();
      }
      var parent = this.parent;
      if (parent) {
        if (parent[_cachePriority] != null) {
          // is group
          parent[_cachePriority] = 0;
        }
        this.parent.update(this);
      }
    }

    // layer position to sprite offset

  }, {
    key: 'pointToOffset',
    value: function pointToOffset(x, y) {
      var _attr2 = this.attr('pos'),
          _attr3 = (0, _slicedToArray3.default)(_attr2, 2),
          x0 = _attr3[0],
          y0 = _attr3[1];

      var dx = x - x0,
          dy = y - y0;

      var transform = this.transform;
      return transform.inverse().transformPoint(dx, dy);
    }
  }, {
    key: 'pointCollision',
    value: function pointCollision(evt) {
      if (!this.isVisible()) {
        return false;
      }

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
        var _originalRect = (0, _slicedToArray3.default)(this.originalRect, 4),
            ox = _originalRect[0],
            oy = _originalRect[1],
            ow = _originalRect[2],
            oh = _originalRect[3];

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

    // OBB: http://blog.csdn.net/silangquan/article/details/50812425

  }, {
    key: 'OBBCollision',
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
    key: 'draw',
    value: function draw(t) {
      var drawingContext = this.context;
      var bound = this.originalRect;
      var cachableContext = null;
      // solve 1px problem
      if (this.cachePriority > this.__cachePolicyThreshold) {
        if (this.cache) {
          cachableContext = this.cache;
        } else {
          cachableContext = _render.cacheContextPool.get(drawingContext);
          if (cachableContext) {
            cachableContext.canvas.width = Math.ceil(bound[2]) + 2;
            cachableContext.canvas.height = Math.ceil(bound[3]) + 2;
          } else {
            this.__cachePolicyThreshold = Infinity;
          }
        }
      }

      this[_cachePriority] = Math.min(this[_cachePriority] + 1, 10);
      var evtArgs = { context: drawingContext, cacheContext: cachableContext, target: this, renderTime: t, fromCache: !!this.cache };

      drawingContext.save();
      drawingContext.translate.apply(drawingContext, (0, _toConsumableArray3.default)(this.attr('pos')));
      drawingContext.transform.apply(drawingContext, (0, _toConsumableArray3.default)(this.transform.m));
      drawingContext.globalAlpha *= this.attr('opacity');

      if (!cachableContext) {
        drawingContext.translate(bound[0], bound[1]);
      } else {
        // solve 1px problem
        cachableContext.translate(1, 1);
      }

      this.dispatchEvent('beforedraw', evtArgs, true, true);

      if (cachableContext) {
        // set cache before render for group
        if (!this.cache) {
          this.cache = cachableContext;
          this.render(t, cachableContext);
        }
      } else {
        this.render(t, drawingContext);
      }

      if (cachableContext) {
        drawingContext.drawImage(cachableContext.canvas, bound[0] - 1, bound[1] - 1);
      }

      this.dispatchEvent('afterdraw', evtArgs, true, true);

      drawingContext.restore();
      this.lastRenderBox = this.renderBox;

      return drawingContext;
    }
  }, {
    key: 'render',
    value: function render(t, drawingContext) {
      var border = this.attr('border'),
          borderRadius = this.attr('borderRadius'),
          padding = this.attr('padding'),
          _offsetSize2 = (0, _slicedToArray3.default)(this.offsetSize, 2),
          offsetWidth = _offsetSize2[0],
          offsetHeight = _offsetSize2[1],
          _clientSize = (0, _slicedToArray3.default)(this.clientSize, 2),
          clientWidth = _clientSize[0],
          clientHeight = _clientSize[1];


      if (offsetWidth === 0 || offsetHeight === 0) {
        return; // don't need to render
      }

      var borderWidth = border.width;
      var borderStyle = border.style;

      // draw border
      if (borderWidth) {
        drawingContext.lineWidth = borderWidth;

        var x = borderWidth / 2,
            y = borderWidth / 2,
            w = offsetWidth - borderWidth,
            h = offsetHeight - borderWidth,
            r = borderRadius;


        (0, _render.drawRadiusBox)(drawingContext, { x: x, y: y, w: w, h: h, r: r });

        if (borderStyle && borderStyle !== 'solid') {
          var dashOffset = this.attr('dashOffset');
          drawingContext.lineDashOffset = dashOffset;
          if (borderStyle === 'dashed') {
            borderStyle = [borderWidth * 3, borderWidth * 3];
          }
          drawingContext.setLineDash(borderStyle);
        }
        drawingContext.strokeStyle = (0, _render.findColor)(drawingContext, this, 'border');
        drawingContext.stroke();
      }

      // draw bgcolor
      var bgcolor = (0, _render.findColor)(drawingContext, this, 'bgcolor');

      if (this.cache == null || borderWidth || borderRadius || bgcolor) {
        var _ref5 = [borderWidth, borderWidth, clientWidth, clientHeight, Math.max(0, borderRadius - borderWidth / 2)],
            _x4 = _ref5[0],
            _y = _ref5[1],
            _w = _ref5[2],
            _h = _ref5[3],
            _r = _ref5[4];


        (0, _render.drawRadiusBox)(drawingContext, { x: _x4, y: _y, w: _w, h: _h, r: _r });

        if (bgcolor) {
          drawingContext.fillStyle = bgcolor;
          drawingContext.fill();
        }
        // we should always clip to prevent the subclass rendering not to overflow the box
        // but clip is very slow in wxapp simulator...
        if (!(typeof wx !== 'undefined' && wx.navigateToMiniProgram && typeof requestAnimationFrame !== 'undefined')) {
          drawingContext.clip();
        }
      }

      drawingContext.translate(borderWidth + padding[3], borderWidth + padding[0]);
    }
  }, {
    key: 'cachePriority',
    get: function get() {
      return this[_cachePriority];
    }
  }, {
    key: 'layer',
    get: function get() {
      return this.parent && this.parent.layer;
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
    key: 'zIndex',
    set: function set(val) {
      this.attr('zIndex', val);
    },
    get: function get() {
      return this.attr('zIndex');
    }
  }, {
    key: 'transform',
    get: function get() {
      var transform = new _spriteMath.Matrix(this[_attr].get('transformMatrix'));
      var transformOrigin = this.attr('transformOrigin');
      if (transformOrigin) {
        var t = new _spriteMath.Matrix();
        t.translate.apply(t, (0, _toConsumableArray3.default)(transformOrigin));
        t.multiply(transform);
        t.translate.apply(t, (0, _toConsumableArray3.default)(transformOrigin.map(function (v) {
          return -v;
        })));
        return t;
      }
      return transform;
    }
  }, {
    key: 'contentSize',
    get: function get() {
      var _attr4 = this.attr('size'),
          _attr5 = (0, _slicedToArray3.default)(_attr4, 2),
          width = _attr5[0],
          height = _attr5[1];

      return [width | 0, height | 0];
    }

    // content + padding

  }, {
    key: 'clientSize',
    get: function get() {
      var _attr6 = this.attr('padding'),
          _attr7 = (0, _slicedToArray3.default)(_attr6, 4),
          top = _attr7[0],
          right = _attr7[1],
          bottom = _attr7[2],
          left = _attr7[3],
          _contentSize = (0, _slicedToArray3.default)(this.contentSize, 2),
          width = _contentSize[0],
          height = _contentSize[1];

      return [left + width + right, top + height + bottom];
    }

    // content + padding + border

  }, {
    key: 'offsetSize',
    get: function get() {
      var _attr8 = this.attr('border'),
          borderWidth = _attr8.width,
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
    key: 'boundingRect',
    get: function get() {
      var transform = this.transform;

      var _originalRect2 = (0, _slicedToArray3.default)(this.originalRect, 2),
          ox = _originalRect2[0],
          oy = _originalRect2[1];

      var _offsetSize3 = (0, _slicedToArray3.default)(this.offsetSize, 2),
          width = _offsetSize3[0],
          height = _offsetSize3[1];

      var vertexs = [[ox, oy], [width + ox, oy], [ox, height + oy], [width + ox, height + oy]];

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

      return [minX, minY].concat([maxX - minX, maxY - minY]);
    }

    // rect before transform

  }, {
    key: 'originalRect',
    get: function get() {
      var _offsetSize4 = (0, _slicedToArray3.default)(this.offsetSize, 2),
          width = _offsetSize4[0],
          height = _offsetSize4[1],
          _attr9 = this.attr('anchor'),
          _attr10 = (0, _slicedToArray3.default)(_attr9, 2),
          anchorX = _attr10[0],
          anchorY = _attr10[1];

      return [-anchorX * width, -anchorY * height, width, height];
    }
  }, {
    key: 'originalRenderRect',
    get: function get() {
      var bound = this.originalRect,
          pos = this.attr('pos');

      return [pos[0] + bound[0], pos[1] + bound[1], bound[2], bound[3]];
    }
  }, {
    key: 'renderBox',
    get: function get() {
      var bound = this.boundingRect,
          pos = this.attr('pos');

      return [pos[0] + bound[0] - 1, pos[1] + bound[1] - 1, pos[0] + bound[0] + bound[2] + 1, pos[1] + bound[1] + bound[3] + 1];
    }
  }, {
    key: 'renderRect',
    get: function get() {
      var bound = this.boundingRect,
          pos = this.attr('pos');

      return [pos[0] + bound[0], pos[1] + bound[1], bound[2], bound[3]];
    }
  }, {
    key: 'vertices',
    get: function get() {
      var vertices = (0, _spriteUtils.rectVertices)(this.originalRect),
          transform = this.transform,
          _attr11 = this.attr('pos'),
          _attr12 = (0, _slicedToArray3.default)(_attr11, 2),
          x0 = _attr12[0],
          y0 = _attr12[1];


      return vertices.map(function (v) {
        var _transform$transformP = transform.transformPoint(v[0], v[1]),
            _transform$transformP2 = (0, _slicedToArray3.default)(_transform$transformP, 2),
            x = _transform$transformP2[0],
            y = _transform$transformP2[1];

        return [x0 + x, y0 + y];
      });
    }
  }, {
    key: 'cache',
    set: function set(context) {
      if (this.cacheContext && context !== this.cacheContext) {
        _render.cacheContextPool.put(this.cacheContext);
      }
      this.cacheContext = context;
    },
    get: function get() {
      return this.cacheContext;
    }
  }], [{
    key: 'defineAttributes',
    value: function defineAttributes(attrs) {
      var _this6 = this;

      this.Attr = function (_Attr) {
        (0, _inherits3.default)(_class2, _Attr);

        function _class2(subject) {
          (0, _classCallCheck3.default)(this, _class2);

          var _this5 = (0, _possibleConstructorReturn3.default)(this, (_class2.__proto__ || (0, _getPrototypeOf2.default)(_class2)).call(this, subject));

          attrs.init(_this5, subject);
          return _this5;
        }

        return _class2;
      }(this.Attr);
      (0, _entries2.default)(attrs).forEach(function (_ref6) {
        var _ref7 = (0, _slicedToArray3.default)(_ref6, 2),
            prop = _ref7[0],
            handler = _ref7[1];

        var getter = function getter() {
          return this.get(prop);
        };
        if (typeof handler !== 'function' && handler.set) {
          getter = handler.get || getter;
          handler = handler.set;
        }
        if (prop !== 'init') {
          _this6.Attr.prototype.__attributeNames.push(prop);
          (0, _defineProperty3.default)(_this6.Attr.prototype, prop, {
            set: function set(val) {
              this.__clearCacheTag = false;
              this.__updateTag = false;
              handler(this, val);
              if (this.subject && this.__updateTag) {
                this.subject.forceUpdate(this.__clearCacheTag);
              }
              delete this.__updateTag;
              delete this.__clearCacheTag;
            },

            get: getter
          });
        }
      });
      return this.Attr;
    }
  }]);
  return BaseSprite;
}(_basenode2.default), _class.Attr = _attr14.default, _temp);
exports.default = BaseSprite;


(0, _nodetype.registerNodeType)('basesprite', BaseSprite);