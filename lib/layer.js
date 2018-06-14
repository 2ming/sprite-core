'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _basenode = require('./basenode');

var _basenode2 = _interopRequireDefault(_basenode);

var _batch = require('./batch');

var _batch2 = _interopRequireDefault(_batch);

var _group = require('./group');

var _group2 = _interopRequireDefault(_group);

var _spriteAnimator = require('sprite-animator');

var _fastAnimationFrame = require('fast-animation-frame');

var _nodetype = require('./nodetype');

var _dirtyCheck = require('./helpers/dirty-check');

var _spriteUtils = require('sprite-utils');

var _group3 = require('./helpers/group');

var _group4 = _interopRequireDefault(_group3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _children = (0, _symbol2.default)('children'),
    _updateSet = (0, _symbol2.default)('updateSet'),
    _zOrder = (0, _symbol2.default)('zOrder'),
    _tRecord = (0, _symbol2.default)('tRecord'),
    _timeline = (0, _symbol2.default)('timeline'),
    _renderDeferer = (0, _symbol2.default)('renderDeferrer'),
    _drawTask = (0, _symbol2.default)('drawTask');

var Layer = function (_BaseNode) {
  (0, _inherits3.default)(Layer, _BaseNode);

  function Layer() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        context = _ref.context,
        _ref$handleEvent = _ref.handleEvent,
        handleEvent = _ref$handleEvent === undefined ? true : _ref$handleEvent,
        _ref$evaluateFPS = _ref.evaluateFPS,
        evaluateFPS = _ref$evaluateFPS === undefined ? false : _ref$evaluateFPS,
        _ref$renderMode = _ref.renderMode,
        renderMode = _ref$renderMode === undefined ? 'repaintAll' : _ref$renderMode,
        _ref$shadowContext = _ref.shadowContext,
        shadowContext = _ref$shadowContext === undefined ? true : _ref$shadowContext,
        _ref$autoRender = _ref.autoRender,
        autoRender = _ref$autoRender === undefined ? true : _ref$autoRender;

    (0, _classCallCheck3.default)(this, Layer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Layer.__proto__ || (0, _getPrototypeOf2.default)(Layer)).call(this));

    _this.handleEvent = handleEvent;
    _this.evaluateFPS = evaluateFPS;
    _this.autoRender = autoRender;

    // renderMode: repaintAll | repaintDirty
    _this.renderMode = renderMode;

    _this.outputContext = context;

    if (shadowContext) {
      if ((typeof shadowContext === 'undefined' ? 'undefined' : (0, _typeof3.default)(shadowContext)) === 'object') {
        _this.shadowContext = shadowContext;
      } else if (context.canvas && context.canvas.cloneNode) {
        var shadowCanvas = context.canvas.cloneNode();
        _this.shadowContext = shadowCanvas.getContext('2d');
      }
    }

    // auto release
    /* istanbul ignore if  */
    if (context.canvas && context.canvas.addEventListener) {
      context.canvas.addEventListener('DOMNodeRemovedFromDocument', function () {
        _this.timeline.clear();
        _this.clear();
      });
    }

    _this[_children] = [];
    _this[_updateSet] = new _set2.default();
    _this[_zOrder] = 0;
    _this[_tRecord] = []; // calculate FPS
    _this[_timeline] = new _spriteAnimator.Timeline();
    _this[_renderDeferer] = null;
    return _this;
  }

  (0, _createClass3.default)(Layer, [{
    key: 'clearContext',
    value: function clearContext(context) {
      if (context.canvas) {
        var _context$canvas = context.canvas,
            width = _context$canvas.width,
            height = _context$canvas.height;

        context.clearRect(0, 0, width, height);
      }
    }
  }, {
    key: 'remove',
    value: function remove() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length === 0) {
        (0, _spriteUtils.setDeprecation)('layer.remove()', 'Instead use layer.clear().');
        return this.clear();
      }
      return args.map(function (child) {
        return _this2.removeChild(child);
      });
    }
  }, {
    key: 'prepareRender',
    value: function prepareRender() {
      var _this3 = this;

      if (!this[_renderDeferer]) {
        this[_renderDeferer] = {};
        this[_renderDeferer].promise = new _promise2.default(function (resolve, reject) {
          (0, _assign2.default)(_this3[_renderDeferer], { resolve: resolve, reject: reject });
          if (_this3.autoRender) {
            _this3[_drawTask] = (0, _fastAnimationFrame.requestAnimationFrame)(function (t) {
              delete _this3[_drawTask];
              _this3.draw(t);
            });
          }
        });
        // .catch(ex => console.error(ex.message))
      }
      return this[_renderDeferer] ? this[_renderDeferer].promise : _promise2.default.resolve();
    }
  }, {
    key: 'draw',
    value: function draw(t) {
      /* istanbul ignore if  */
      if (t && this.evaluateFPS) {
        this[_tRecord].push(t);
        this[_tRecord] = this[_tRecord].slice(-10);
      }

      var updateSet = this[_updateSet];
      if (updateSet.size) {
        var renderer = void 0;
        if (this.renderMode === 'repaintDirty') {
          renderer = this.renderRepaintDirty.bind(this);
        } else if (this.renderMode === 'repaintAll') {
          renderer = this.renderRepaintAll.bind(this);
        } else {
          /* istanbul ignore next  */
          throw new Error('unknown render mode!');
        }
        var currentTime = this.timeline.currentTime;
        renderer(currentTime);

        (0, _get3.default)(Layer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Layer.prototype), 'dispatchEvent', this).call(this, 'update', { target: this, timeline: this.timeline, renderTime: currentTime }, true);
      }
      if (this[_renderDeferer]) {
        if (this[_drawTask]) {
          (0, _fastAnimationFrame.cancelAnimationFrame)(this[_drawTask]);
          delete this[_drawTask];
        }
        this[_renderDeferer].resolve();
        this[_renderDeferer] = null;
      }
    }
  }, {
    key: 'update',
    value: function update(target) {
      if (target && this[_updateSet].has(target)) return;
      if (target) this[_updateSet].add(target);
      this.prepareRender();
    }
  }, {
    key: 'isVisible',
    value: function isVisible(sprite) {
      if (!sprite.isVisible()) {
        return false;
      }
      if (sprite.parent !== this) {
        return false;
      }
      return true;
    }
  }, {
    key: 'drawSprites',
    value: function drawSprites(renderEls, t) {
      for (var i = 0; i < renderEls.length; i++) {
        var child = renderEls[i];
        if (child.parent === this) {
          var isVisible = this.isVisible(child);
          if (isVisible) {
            child.draw(t);
            if (this.renderMode === 'repaintDirty') {
              child.lastRenderBox = child.renderBox;
            } else {
              child.lastRenderBox = 'no-calc';
            }
          } else {
            // invisible, only need to remove lastRenderBox
            delete child.lastRenderBox;
          }
          if (child.isDirty) {
            child.isDirty = false;
            child.dispatchEvent('update', { target: child, renderTime: t, isVisible: isVisible }, true, true);
          }
        }
      }
    }
  }, {
    key: 'renderRepaintAll',
    value: function renderRepaintAll(t) {
      var renderEls = this[_children];

      var outputContext = this.outputContext;
      this.clearContext(outputContext);

      var shadowContext = this.shadowContext;

      if (shadowContext) {
        this.clearContext(shadowContext);
        this.drawSprites(renderEls, t);
        outputContext.drawImage(shadowContext.canvas, 0, 0);
      } else {
        this.drawSprites(renderEls, t);
      }

      this[_updateSet].clear();
    }
  }, {
    key: 'renderRepaintDirty',
    value: function renderRepaintDirty(t) {
      var updateEls = [].concat((0, _toConsumableArray3.default)(this[_updateSet]));
      if (updateEls.some(function (el) {
        return !!el.attr('filter') || el.isVirtual || el.lastRenderBox === 'no-calc';
      })) {
        return this.renderRepaintAll(t);
      }

      var shadowContext = this.shadowContext;
      var outputContext = this.outputContext;

      var renderEls = this[_children];

      if (shadowContext) {
        shadowContext.save();
        shadowContext.beginPath();
      }
      outputContext.save();
      outputContext.beginPath();

      (0, _dirtyCheck.clearDirtyRects)({ shadowContext: shadowContext, outputContext: outputContext }, updateEls, true);

      if (shadowContext) {
        shadowContext.clip();
        outputContext.clip();
        this.clearContext(shadowContext);
      }
      outputContext.clip();
      this.clearContext(outputContext);

      this.drawSprites(renderEls, t);
      if (shadowContext) {
        outputContext.drawImage(shadowContext.canvas, 0, 0);
        shadowContext.restore();
      }

      outputContext.restore();
      this[_updateSet].clear();
    }
  }, {
    key: 'pointCollision',
    value: function pointCollision(evt) {
      if (this.outputContext.canvas) {
        var layerX = evt.layerX,
            layerY = evt.layerY;
        var _outputContext$canvas = this.outputContext.canvas,
            width = _outputContext$canvas.width,
            height = _outputContext$canvas.height;


        if (layerX >= 0 && layerY >= 0 && layerX < width && layerY < height) {
          return true;
        }
        return false;
      }
      /* istanbul ignore next  */
      return true;
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
          var sprites = this[_children].slice(0).reverse(),
              targetSprites = [];
          for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            var hit = sprite.dispatchEvent(type, evt, collisionState, swallow);
            if (hit) {
              // detect mouseenter/mouseleave
              targetSprites.push(sprite);
            }
            if (evt.terminated && !evt.type.startsWith('mouse')) {
              break;
            }
          }
          evt.targetSprites = targetSprites;
          // stopDispatch can only terminate event in the same level
          evt.terminated = false;
          return (0, _get3.default)(Layer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Layer.prototype), 'dispatchEvent', this).call(this, type, evt, isCollision, swallow);
        }
      }

      return (0, _get3.default)(Layer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Layer.prototype), 'dispatchEvent', this).call(this, type, evt, collisionState, swallow);
    }
  }, {
    key: 'connect',
    value: function connect(parent, zOrder, zIndex) /* istanbul ignore next  */{
      (0, _get3.default)(Layer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Layer.prototype), 'connect', this).call(this, parent, zOrder);
      this.zIndex = zIndex;
      if (parent && parent.container) {
        parent.container.appendChild(this.outputContext.canvas);
      }
      return this;
    }
  }, {
    key: 'disconnect',
    value: function disconnect(parent) /* istanbul ignore next  */{
      if (this.canvas && this.canvas.remove) {
        this.canvas.remove();
      }
      return (0, _get3.default)(Layer.prototype.__proto__ || (0, _getPrototypeOf2.default)(Layer.prototype), 'disconnect', this).call(this, parent);
    }
  }, {
    key: 'group',
    value: function group() {
      var group = new _group2.default();
      group.append.apply(group, arguments);
      this.appendChild(group);
      return group;
    }
  }, {
    key: 'batch',
    value: function batch() {
      var _this4 = this;

      for (var _len2 = arguments.length, sprites = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        sprites[_key2] = arguments[_key2];
      }

      sprites.forEach(function (sprite) {
        if (sprite.layer !== _this4) {
          _this4.appendChild(sprite);
        }
      });
      var batch = new _batch2.default(this);
      batch.add.apply(batch, sprites);
      return batch;
    }
  }, {
    key: 'adjust',
    value: function adjust(handler) /* istanbul ignore next  */{
      var update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var outputContext = this.outputContext,
          shadowContext = this.shadowContext;
      if (!shadowContext) {
        throw new Error('No shadowContext.');
      }
      this.clearContext(outputContext);

      handler.call(this, outputContext);

      if (update) {
        outputContext.drawImage(shadowContext.canvas, 0, 0);
      }
    }
  }, {
    key: 'clearUpdate',
    value: function clearUpdate() {
      /* istanbul ignore next  */
      this[_updateSet].clear();
    }
  }, {
    key: 'layer',
    get: function get() {
      return this;
    }
  }, {
    key: 'children',
    get: function get() {
      return this[_children];
    }
  }, {
    key: 'timeline',
    get: function get() {
      return this[_timeline];
    }
  }, {
    key: 'context',
    get: function get() {
      return this.shadowContext ? this.shadowContext : this.outputContext;
    }
  }, {
    key: 'canvas',
    get: function get() {
      return this.outputContext.canvas;
    }
  }, {
    key: 'offset',
    get: function get() {
      return [0, 0];
    }
  }, {
    key: 'fps',
    get: function get() /* istanbul ignore next  */{
      if (!this.evaluateFPS) {
        return NaN;
      }
      var sum = 0;
      var tr = this[_tRecord].slice(-10);
      var len = tr.length;

      if (len <= 5) {
        return NaN;
      }
      tr.reduceRight(function (a, b, i) {
        sum += a - b;return b;
      });

      return Math.round(1000 * (len - 1) / sum);
    }
  }]);
  return Layer;
}(_basenode2.default);

exports.default = Layer;


(0, _assign2.default)(Layer.prototype, _group4.default);

(0, _nodetype.registerNodeType)('layer', Layer, true);