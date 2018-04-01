import SpriteAttr from './attr'
import BaseNode from './basenode'
import {Matrix, Vector} from 'sprite-math'
import Animation from './animation'
import {rectVertices} from 'sprite-utils'
import createGradients from './gradient'
import {registerNodeType} from './nodetype'

const _attr = Symbol('attr'),
  _animations = Symbol('animations')

export default class BaseSprite extends BaseNode {
  static Attr = SpriteAttr;

  /**
    new Sprite({
      attr: {
        ...
      }
    })
   */
  constructor(attr) {
    super()

    this[_attr] = new this.constructor.Attr(this)
    this[_animations] = new Set()

    if(attr) {
      this.attr(attr)
    }
  }

  get layer() {
    let node = this
    do {
      node = node.parent
    } while(node != null && !(node.drawSprites))
    return node
  }

  serialize() {
    const nodeType = this.nodeType,
      attrs = this[_attr].serialize(),
      id = this.id

    return {
      nodeType,
      attrs,
      id,
    }
  }

  merge(attrs) {
    this[_attr].merge(attrs)
  }

  cloneNode(copyContent) {
    const node = new this.constructor()
    if(copyContent) {
      node.merge(this[_attr].serialize())
    }
    return node
  }

  set id(val) {
    this.attr('id', val)
  }
  get id() {
    return this.attr('id')
  }

  set name(val) {
    this.attr('name', val)
  }
  get name() {
    return this.attr('name')
  }

  getAttribute(prop) {
    return this.attr(prop)
  }
  setAttribute(prop, val) {
    return this.attr(prop, val)
  }
  removeAttribute(prop) {
    return this.attr(prop, null)
  }

  attr(props, val) {
    if(typeof props === 'object') {
      Object.assign(this[_attr], props)
      return this
    } else if(typeof props === 'string') {
      if(val !== undefined) {
        Object.assign(this[_attr], {[props]: val})
        return this
      }
      const attrs = this[_attr].attrs
      return attrs[props]
    }

    return this[_attr].attrs
  }
  attrs() {
    return this[_attr].attrs
  }

  get transform() {
    return new Matrix(this[_attr].get('transformMatrix'))
  }

  animate(frames, timing) {
    const animation = new Animation(this, frames, timing)
    if(this.layer) {
      animation.baseTimeline = this.layer.timeline
      animation.play()
      animation.finished.then(() => {
        this[_animations].delete(animation)
      })
    }
    this[_animations].add(animation)
    return animation
  }

  connect(parent, zOrder = 0) {
    if(parent && !(parent instanceof BaseNode)) {
      const node = new BaseNode()
      node.context = parent
      parent = node
    }
    const ret = super.connect(parent, zOrder)
    Object.defineProperty(this, 'context', {
      get: () => parent.cache || parent.context,
      configurable: true,
    })
    this[_animations].forEach((animation) => {
      animation.baseTimeline = parent.timeline
      animation.play()
      animation.finished.then(() => {
        this[_animations].delete(animation)
      })
    })
    return ret
  }

  disconnect(parent) {
    this[_animations].forEach(animation => animation.cancel())
    const ret = super.disconnect(parent)
    delete this.context
    return ret
  }

  // content width / height
  get contentSize() {
    const [width, height] = this.attr('size')

    return [width | 0, height | 0]
  }

  // content + padding
  get clientSize() {
    const [top, right, bottom, left] = this.attr('padding'),
      [width, height] = this.contentSize

    return [left + width + right, top + height + bottom]
  }

  // content + padding + border
  get offsetSize() {
    const [borderWidth] = this.attr('border'),
      [width, height] = this.clientSize

    return [width + 2 * borderWidth,
      height + 2 * borderWidth]
  }

  get innerSize() {
    return this.contentSize
  }

  get outerSize() {
    return this.offsetSize
  }

  get boundRect() {
    const anchor = this.attr('anchor'),
      transform = this.transform

    const [width, height] = this.offsetSize

    const [anchorX, anchorY] = anchor

    const vertexs = [[-anchorX * width, -anchorY * height],
      [(1 - anchorX) * width, -anchorY * height],
      [-anchorX * width, (1 - anchorY) * height],
      [(1 - anchorX) * width, (1 - anchorY) * height]]

    const transformed = vertexs.map(v => transform.transformPoint(v[0], v[1]))
    const vx = transformed.map(v => v[0]),
      vy = transformed.map(v => v[1])

    const minX = Math.min(...vx),
      minY = Math.min(...vy),
      maxX = Math.max(...vx),
      maxY = Math.max(...vy)

    return [...[minX, minY].map(Math.floor),
      ...[maxX - minX, maxY - minY].map(Math.ceil)]
  }

  // rect before transform
  get originRect() {
    const [width, height] = this.offsetSize,
      [anchorX, anchorY] = this.attr('anchor')

    return [Math.floor(-anchorX * width),
      Math.floor(-anchorY * height),
      width, height]
  }

  get originRenderRect() {
    const bound = this.originRect,
      pos = this.attr('pos')

    return [pos[0] + bound[0],
      pos[1] + bound[1],
      bound[2],
      bound[3]]
  }

  get renderBox() {
    const bound = this.boundRect,
      pos = this.attr('pos')

    return [pos[0] + bound[0] - 1,
      pos[1] + bound[1] - 1,
      pos[0] + bound[0] + bound[2] + 1,
      pos[1] + bound[1] + bound[3] + 1]
  }

  get renderRect() {
    const bound = this.boundRect,
      pos = this.attr('pos')

    return [pos[0] + bound[0],
      pos[1] + bound[1],
      bound[2],
      bound[3]]
  }

  get vertices() {
    const vertices = rectVertices(this.originRect),
      transform = this.transform,
      [x0, y0] = this.attr('pos')

    return vertices.map((v) => {
      const [x, y] = transform.transformPoint(v[0], v[1])
      return [Math.round(x0 + x), Math.round(y0 + y)]
    })
  }

  // OBB: http://blog.csdn.net/silangquan/article/details/50812425
  OBBCollision(sprite) {
    // vertices: [p1, p2, p3, p4]
    const [p11, p12, p13] = this.vertices,
      [p21, p22, p23] = sprite.vertices

    const a1 = (new Vector(p12, p11)).unit(),
      a2 = (new Vector(p13, p12)).unit(),
      a3 = (new Vector(p22, p21)).unit(),
      a4 = (new Vector(p23, p22)).unit()

    // The projection of the axis of a vertex in a certain direction
    function verticesProjection(vertices, axis) {
      const [p1, p2, p3, p4] = vertices.map(v => axis.dot(new Vector(v)))

      return [Math.min(p1, p2, p3, p4), Math.max(p1, p2, p3, p4)]
    }

    function projectionIntersect(p1, p2) {
      const m1 = (p1[0] + p1[1]) / 2,
        l1 = Math.abs(p1[1] - p1[0]),
        m2 = (p2[0] + p2[1]) / 2,
        l2 = Math.abs(p2[1] - p2[0])

      return Math.abs(m2 - m1) <= (l1 + l2) / 2
    }

    return projectionIntersect(
      verticesProjection(this.vertices, a1),
      verticesProjection(sprite.vertices, a1)
    ) && projectionIntersect(
      verticesProjection(this.vertices, a2),
      verticesProjection(sprite.vertices, a2)
    ) && projectionIntersect(
      verticesProjection(this.vertices, a3),
      verticesProjection(sprite.vertices, a3)
    ) && projectionIntersect(
      verticesProjection(this.vertices, a4),
      verticesProjection(sprite.vertices, a4)
    )
  }

  set cache(context) {
    this.cacheContext = context
  }

  get cache() {
    return this.cacheContext
  }

  remove() {
    if(!this.parent) return false
    this.parent.removeChild(this)
    return true
  }

  appendTo(parent) {
    parent.appendChild(this)
  }

  forceUpdate(clearCache = false) {
    const parent = this.parent
    if(parent) {
      if(parent.forceUpdate) {
        parent.forceUpdate(true)
      } else if(parent.update) {
        if(clearCache) {
          this.cache = null
        }
        this.parent.update(this)
      }
    }
  }

  // layer position to sprite offset
  pointToOffset(x, y) {
    const attr = this.attr()
    const [dx, dy] = [x - attr.x, y - attr.y]
    const transform = this.transform
    return transform.inverse().transformPoint(dx, dy)
  }

  pointCollision(evt) {
    let parentX,
      parentY

    if(evt.parentX != null) {
      // group
      parentX = evt.parentX
      parentY = evt.parentY
    } else {
      parentX = evt.layerX
      parentY = evt.layerY
    }

    const [x, y, w, h] = this.renderRect

    if(parentX >= x && parentX - x < w
     && parentY >= y && parentY - y < h) {
      const [ox, oy, ow, oh] = this.originRect

      const [nx, ny] = this.pointToOffset(parentX, parentY)

      if(nx >= ox && nx - ox < ow
        && ny >= oy && ny - oy < oh) {
        evt.offsetX = nx
        evt.offsetY = ny

        return true
      }
    }
  }
  draw(t, ...args) {
    const drawingContext = this.context
    if(!drawingContext) {
      throw new Error('No context!')
    }

    let context = drawingContext

    const transform = this.transform.m,
      pos = this.attr('pos'),
      bound = this.originRect

    drawingContext.save()
    drawingContext.translate(pos[0], pos[1])
    drawingContext.transform(...transform)
    drawingContext.globalAlpha = this.attr('opacity')

    if(drawingContext.canvas && drawingContext.canvas.cloneNode) {
      context = this.cache
      if(!context) {
        const cacheCanvas = drawingContext.canvas.cloneNode(false)
        cacheCanvas.width = bound[2]
        cacheCanvas.height = bound[3]
        context = cacheCanvas.getContext('2d')
      }
    } else {
      context.translate(bound[0], bound[1])
    }

    // too slow in wxapp
    // if(context === drawingContext) {
    //   const [w, h] = this.offsetSize
    //   context.save()
    //   context.beginPath()
    //   context.rect(0, 0, w, h)
    //   context.clip()
    //   context.closePath()
    // }

    this.dispatchEvent('beforedraw', {context, target: this, renderTime: t}, true, true)
    if(context !== this.cache) {
      // set cache before render for group
      if(context !== drawingContext) this.cache = context
      context = this.render(t, context)
    }
    this.dispatchEvent('afterdraw', {context, target: this, renderTime: t}, true, true)

    // if(context === drawingContext) {
    //   context.restore()
    // }

    if(context !== drawingContext) {
      drawingContext.drawImage(context.canvas, bound[0], bound[1])
    }
    drawingContext.restore()


    const updateHandlers = this.getEventHandlers('update')
    if(updateHandlers.length) {
      this.dispatchEvent(
        'update',
        {
          target: this, context, renderBox: this.renderBox, lastRenderBox: this.lastRenderBox,
        },
        true
      )
    }
    this.lastRenderBox = this.renderBox

    return drawingContext
  }

  render(t, drawingContext) {
    const attr = this.attr(),
      bgcolor = attr.bgcolor,
      gradients = attr.gradients,
      [offsetWidth, offsetHeight] = this.offsetSize,
      [clientWidth, clientHeight] = this.clientSize

    if(offsetWidth === 0 || offsetHeight === 0) {
      return drawingContext // don't need to render
    }

    const [borderWidth, borderColor] = attr.border
    const borderRadius = attr.borderRadius

    drawingContext.save()

    // draw border
    if(borderWidth || gradients && gradients.border) {
      drawingContext.lineWidth = borderWidth

      const [x, y, w, h, r] = [borderWidth / 2, borderWidth / 2,
        offsetWidth - borderWidth, offsetHeight - borderWidth,
        borderRadius]

      drawingContext.beginPath()
      drawingContext.moveTo(x + r, y)
      drawingContext.arcTo(x + w, y, x + w, y + h, r)
      drawingContext.arcTo(x + w, y + h, x, y + h, r)
      drawingContext.arcTo(x, y + h, x, y, r)
      drawingContext.arcTo(x, y, x + w, y, r)
      drawingContext.closePath()

      if(gradients && gradients.border) {
        const rect = gradients.border.rect || [x, y, w, h]

        drawingContext.strokeStyle = createGradients(drawingContext, rect, gradients.border)
      } else if(borderColor) {
        drawingContext.strokeStyle = borderColor
      }

      drawingContext.stroke()
      drawingContext.clip()
    }

    // draw bgcolor
    if(bgcolor || gradients && gradients.bgcolor) {
      const [x, y, w, h, r] = [borderWidth, borderWidth,
        clientWidth, clientHeight,
        Math.max(0, borderRadius - borderWidth / 2)]

      drawingContext.beginPath()
      drawingContext.moveTo(x + r, y)
      drawingContext.arcTo(x + w, y, x + w, y + h, r)
      drawingContext.arcTo(x + w, y + h, x, y + h, r)
      drawingContext.arcTo(x, y + h, x, y, r)
      drawingContext.arcTo(x, y, x + w, y, r)
      drawingContext.closePath()

      if(gradients && gradients.bgcolor) {
        const rect = gradients.bgcolor.rect || [x, y, w, h]

        drawingContext.fillStyle = createGradients(drawingContext, rect, gradients.bgcolor)
      } else if(bgcolor) {
        drawingContext.fillStyle = bgcolor
      }

      drawingContext.fill()
    }

    drawingContext.restore()

    const padding = attr.padding,
      paddingTop = padding[0],
      paddingLeft = padding[3]

    drawingContext.translate(paddingLeft, paddingTop)

    return drawingContext
  }
}

registerNodeType('basesprite', BaseSprite)
