import {Matrix} from 'sprite-math'
import {parseColorString, oneOrTwoValues, fourValuesShortCut,
  parseStringInt, parseStringFloat, parseStringTransform, parseValue, attr, deprecate} from 'sprite-utils'
import {getSvgPath} from './platform'

const _attr = Symbol('attr'),
  _temp = Symbol('store'),
  _subject = Symbol('subject'),
  _default = Symbol('default')

class SpriteAttr {
  constructor(subject) {
    this[_subject] = subject
    this[_default] = {}
    this[_attr] = {}
    this.setDefault({
      anchor: [0, 0],
      x: 0,
      y: 0,
      opacity: 1,
      width: '',
      height: '',
      bgcolor: '',
      rotate: 0,
      scale: [1, 1],
      translate: [0, 0],
      skew: [0, 0],
      transform: 'matrix(1,0,0,1,0,0)',
      transformMatrix: [1, 0, 0, 1, 0, 0],
      border: [0, 'rgba(0,0,0,0)'],
      borderRadius: 0,
      padding: [0, 0, 0, 0],
      zIndex: 0,
      offsetRotate: 'auto',
      linearGradients: {},
      offsetDistance: 0,
    }, {
      pos: {
        get() {
          return [this.x, this.y]
        },
      },
      size: {
        get() {
          return [this.width, this.height]
        },
      },
      linearGradients: {
        get() {
          return this.gradients
        },
      },
    })
    this[_temp] = new Map() // save non-serialized values
  }

  setDefault(attrs, props = {}) {
    Object.assign(this[_default], attrs)
    Object.assign(this[_attr], attrs)
    Object.defineProperties(this[_attr], props)
  }

  getAttrState() {
    return this[_attr]
  }

  saveObj(key, val) {
    this[_temp].set(key, val)
  }
  loadObj(key) {
    return this[_temp].get(key)
  }

  quietSet(key, val) {
    this[_attr][key] = val
  }
  set(key, val) {
    if(val == null) {
      val = this[_default][key]
    }
    this[_attr][key] = val
    this.forceUpdate()
  }
  get(key) {
    return this[_attr][key]
  }

  clearCache() {
    if(this.subject) {
      this.subject.cache = null
    }
    return this
  }
  forceUpdate(clearCache) {
    if(this.subject) {
      this.subject.forceUpdate(clearCache)
    }
    return this
  }
  merge(attrs) {
    if(typeof attrs === 'string') {
      attrs = JSON.parse(attrs)
    }

    Object.assign(this[_attr], attrs)

    return this
  }
  serialize() {
    const entries = Object.entries(this[_attr])
    const obj = {}
    entries.forEach(([key, value]) => {
      /* eslint-disable no-prototype-builtins */
      if(key in this) {
        obj[key] = value
      }
      /* eslint-enable no-prototype-builtins */
    })
    return JSON.stringify(obj)
  }

  get attrs() {
    return this[_attr]
  }

  get subject() {
    return this[_subject]
  }

  /* ------------------- define attributes ----------------------- */
  @attr
  set id(val) {
    return this.quietSet('id', String(val))
  }

  @attr
  set name(val) {
    return this.quietSet('name', String(val))
  }

  @attr
  @parseValue(parseStringFloat, oneOrTwoValues)
  set anchor(val) {
    this.set('anchor', val)
  }

  @attr
  set x(val) {
    this.set('x', Math.round(val))
  }

  @attr
  set y(val) {
    this.set('y', Math.round(val))
  }

  @attr
  @parseValue(parseStringInt)
  set pos(val) {
    if(val == null) {
      val = [0, 0]
    }
    const [x, y] = val
    this.x = x
    this.y = y
  }

  @attr
  @parseValue(parseColorString)
  set bgcolor(val) {
    this.clearCache()
    this.set('bgcolor', val)
  }

  @attr
  set opacity(val) {
    this.set('opacity', val)
  }

  @attr
  set width(val) {
    this.clearCache()
    this.set('width', Math.round(val))
  }

  @attr
  set height(val) {
    this.clearCache()
    this.set('height', Math.round(val))
  }

  @attr
  @parseValue(parseStringInt)
  set size(val) {
    if(val == null) {
      val = ['', '']
    }
    const [width, height] = val
    this.width = width
    this.height = height
  }

  @attr
  set border(val) {
    this.clearCache()
    const [width, color] = val
    this.set('border', [width, parseColorString(color)])
  }

  @attr
  @parseValue(parseStringInt, fourValuesShortCut)
  set padding(val) {
    this.clearCache()
    this.set('padding', val)
  }

  @attr
  set borderRadius(val) {
    this.clearCache()
    this.set('borderRadius', val)
  }

  // transform attributes
  @attr
  @parseValue(parseStringTransform)
  set transform(val) {
    /*
      rotate: 0,
      scale: [1, 1],
      translate: [0, 0],
      skew: [0, 0],
      matrix: [1,0,0,1,0,0],
     */
    this.merge({
      rotate: 0,
      scale: [1, 1],
      translate: [0, 0],
      skew: [0, 0],
    })

    if(Array.isArray(val)) {
      this.set('transformMatrix', val)
      this.set('transform', `matrix(${val})`)
    } else {
      this.set('transformMatrix', [1, 0, 0, 1, 0, 0])
      const transformStr = []

      Object.entries(val).forEach(([key, value]) => {
        if(key === 'matrix' && Array.isArray(value)) {
          this.set('transformMatrix', new Matrix(value).m)
        } else {
          this[key] = value
        }
        transformStr.push(`${key}(${value})`)
      })

      this.set('transform', transformStr.join(' '))
    }
  }

  @attr
  set rotate(val) {
    const delta = this.get('rotate') - val
    this.set('rotate', val)
    const transform = new Matrix(this.get('transformMatrix')).rotate(-delta)
    this.set('transformMatrix', transform.m)
  }

  @attr
  set scale(val) {
    val = oneOrTwoValues(val)
    const oldVal = this.get('scale')
    const delta = [val[0] / oldVal[0], val[1] / oldVal[1]]
    this.set('scale', val)

    const offsetAngle = this.get('offsetAngle')
    if(offsetAngle) {
      this.rotate -= offsetAngle
    }

    const transform = new Matrix(this.get('transformMatrix'))
    transform.scale(...delta)
    this.set('transformMatrix', transform.m)

    if(offsetAngle) {
      this.rotate += offsetAngle
    }
  }

  @attr
  set translate(val) {
    const oldVal = this.get('translate')
    const delta = [val[0] - oldVal[0], val[1] - oldVal[1]]
    this.set('translate', val)
    const transform = new Matrix(this.get('transformMatrix'))
    transform.translate(...delta)
    this.set('transformMatrix', transform.m)
  }

  @attr
  set skew(val) {
    const oldVal = this.get('skew')
    const invm = new Matrix().skew(...oldVal).inverse()
    this.set('skew', val)
    const transform = new Matrix(this.get('transformMatrix'))
    transform.multiply(invm).skew(...val)
    this.set('transformMatrix', transform.m)
  }

  @attr
  set zIndex(val) {
    this.set('zIndex', val)
  }

  /**
    linearGradients : {
      bgcolor: {
        direction: 30,  //angle，[0,360)
        rect: [x, y, w, h],
        vector: [x1, y1, x2, y2], // direction/rect or from/to
        colors: [
          {offset: 0, color: 'red'},
          {offset: 1, color: 'black'}
        ]
      }
    }
   */
  @attr
  @deprecate('Instead use attr.gradients.')
  set linearGradients(val) {
    this.gradients = val
  }

  /**
    gradients : {
      bgcolor: {
        direction: 30,  //angle，[0,360)
        rect: [x, y, w, h],  // rect + direction or vector
        vector: [x1, y1, r1, x2, y2, r2], // vector.length -> linear or radial
        colors: [
          {offset: 0, color: 'red'},
          {offset: 1, color: 'black'}
        ]
      }
    }
   */
  @attr
  set gradients(val) {
    this.clearCache()
    this.set('gradients', val)
  }

  resetOffset() {
    let offsetPath = this.get('offsetPath')
    const dis = this.offsetDistance

    if(offsetPath) {
      const pathObj = this.loadObj('offsetPath')
      if(pathObj) {
        offsetPath = pathObj
      } else {
        offsetPath = getSvgPath(offsetPath)
        this.saveObj('offsetPath', offsetPath)
      }
    }

    if(offsetPath != null) {
      const len = dis * offsetPath.getTotalLength(),
        {x, y} = offsetPath.getPointAtLength(len)

      let angle = this.offsetRotate
      if(angle === 'auto' || angle === 'reverse') {
        const delta = offsetPath.getPointAtLength(angle === 'auto' ? len + 1 : len - 1)
        const x1 = delta.x,
          y1 = delta.y

        if(x1 === x && y1 === y) { // last point
          angle = this.get('offsetAngle')
        } else {
          angle = 180 * Math.atan2(y1 - y, x1 - x) / Math.PI
        }

        if(this.offsetRotate === 'reverse') {
          angle = -angle
        }
      }

      const offsetAngle = this.get('offsetAngle')

      if(offsetAngle) {
        this.rotate -= offsetAngle
      }

      this.set('offsetAngle', angle)
      this.rotate += angle

      const offsetPoint = this.get('offsetPoint')
      if(offsetPoint) {
        this.pos = [this.x - offsetPoint[0], this.y - offsetPoint[1]]
      }

      this.set('offsetPoint', [x, y])
      this.pos = [this.x + x, this.y + y]
    }
  }

  @attr
  set offsetPath(val) {
    const offsetPath = getSvgPath(val)

    this.set('offsetPath', offsetPath.getAttribute('d'))
    this.saveObj('offsetPath', offsetPath)
    this.resetOffset()
  }
  @attr
  set offsetDistance(val) {
    this.set('offsetDistance', val)
    this.resetOffset()
  }
  @attr
  set offsetRotate(val) {
    this.set('offsetRotate', val)
    this.resetOffset()
  }
}

export default SpriteAttr
