'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _eventHandlers = (0, _symbol2.default)('eventHandlers'),
    _collisionState = (0, _symbol2.default)('collisionState');

var BaseNode = function () {
  function BaseNode() {
    (0, _classCallCheck3.default)(this, BaseNode);

    this[_eventHandlers] = {};
  }

  (0, _createClass3.default)(BaseNode, [{
    key: 'on',
    value: function on(type, handler) {
      this[_eventHandlers][type] = this[_eventHandlers][type] || [];
      this[_eventHandlers][type].push(handler);
    }
  }, {
    key: 'off',
    value: function off(type, handler) {
      if (handler && this[_eventHandlers][type]) {
        var idx = this[_eventHandlers][type].indexOf(handler);

        if (idx >= 0) {
          this[_eventHandlers][type].splice(idx, 1);
        }
      } else {
        delete this[_eventHandlers][type];
      }
    }
  }, {
    key: 'getEventHandlers',
    value: function getEventHandlers(type) {
      return this[_eventHandlers][type] || [];
    }
    // d3-friendly

  }, {
    key: 'addEventListener',
    value: function addEventListener(type, handler) {
      return this.on(type, handler);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, handler) {
      return this.off(type, handler);
    }
  }, {
    key: 'pointCollision',
    value: function pointCollision(evt) {
      throw Error('you mast override this method');
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(type, evt) {
      var _this = this;

      var forceTrigger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var stopDispatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (!evt.stopDispatch) {
        evt.stopDispatch = function () {
          _this.terminated = true;
        };
      }
      if (evt.type !== type) {
        if (evt.type) {
          evt.originalType = evt.type;
        }
        evt.type = type;
      }

      if (!evt.terminated && (forceTrigger || this.pointCollision(evt))) {
        evt.target = this;

        var handlers = this[_eventHandlers][type];
        if (handlers) {
          handlers.forEach(function (handler) {
            return handler.call(_this, evt);
          });
        }

        if (type === 'mousemove') {
          if (!this[_collisionState]) {
            var _evt = (0, _assign2.default)({}, evt);
            _evt.type = 'mouseenter';
            _evt.terminated = false;

            this.dispatchEvent('mouseenter', _evt);
          }
          this[_collisionState] = true;
        }
      } else if (type === 'mousemove') {
        if (this[_collisionState]) {
          var _evt2 = (0, _assign2.default)({}, evt);
          _evt2.type = 'mouseleave';
          _evt2.target = this;
          _evt2.terminated = false;

          this.dispatchEvent('mouseleave', _evt2, true);
        }
        this[_collisionState] = false;
      }

      if (stopDispatch) {
        this.terminated = true;
      }
      return this[_collisionState];
    }
    // called when layer appendChild

  }, {
    key: 'connect',
    value: function connect(parent) {
      var zOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this.parent) {
        // throw new Error('This node belongs to another parent node! Remove it first...')
        this.disconnect(this.parent);
      }

      Object.defineProperty(this, 'zOrder', {
        value: zOrder,
        writable: false,
        configurable: true
      });

      Object.defineProperty(this, 'parent', {
        get: function get() {
          return parent;
        },
        configurable: true
      });

      var handlers = this[_eventHandlers].append;
      if (handlers && handlers.length) {
        this.dispatchEvent('append', {
          parent: parent,
          zOrder: zOrder
        }, true);
      }

      return this;
    }

    // override to recycling resources

  }, {
    key: 'disconnect',
    value: function disconnect(parent) {
      if (!this.parent || parent !== this.parent) {
        throw new Error('Invalid node to disconnect');
      }

      var zOrder = this.zOrder;
      delete this.zOrder;

      var handlers = this[_eventHandlers].remove;
      if (handlers && handlers.length) {
        this.dispatchEvent('remove', {
          parent: parent,
          zOrder: zOrder
        }, true);
      }

      delete this.parent;

      return this;
    }
  }]);
  return BaseNode;
}();

exports.default = BaseNode;