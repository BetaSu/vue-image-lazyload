const UID_EXT = 'Uid'
const SPEED = '2s'
const EXE_TIMEOUT = 600

export default {
  setUid (el, binding, container) {
    let Uid = `${UID_EXT}__` + new Date().getTime() + Math.ceil(Math.random() * 100)
    el.setAttribute(`data-${UID_EXT}`, Uid)
    let elObj = {}
    elObj.binding = binding
    elObj.el = el
    elObj.Uid = Uid
    if (container) {
      let containerUid = getUid(container)
      lazyLoad[containerUid].elements = lazyLoad[containerUid].elements || {}
      lazyLoad[containerUid].elements[Uid] = elObj
    } else lazyLoad[Uid] = elObj
    return Uid
  },
  getUid (el) {
    return el.getAttribute(`data-${UID_EXT}`)
  },
  isVisible (container, ele) {
    let containerRect = container.getBoundingClientRect()
    let elemRect = ele.getBoundingClientRect()
    let xVisible, yVisible
    let offset = 50
    if (elemRect.bottom + offset >= containerRect.top &&
      elemRect.top - offset <= containerRect.bottom) {
      yVisible = true
    }
    if (elemRect.right + offset >= containerRect.left &&
      elemRect.left - offset <= containerRect.right) {
      xVisible = true
    }
    return xVisible && yVisible
  },
  checkImage (container) {
    let containerUid = getUid(container)
    let elements = lazyLoad[containerUid].elements
    if (!elements) return
    Object.keys(elements).forEach(Uid => {
      let curEle = elements[Uid]
      let targetEle = curEle.el
      if (targetEle && isVisible(container, targetEle)) {
        readyToLoad(targetEle, containerUid, true)
      }
    })
  },
  addImg (container, Uid) {
    let containerUid = getUid(container)
    let containerObj = lazyLoad[containerUid]
    if (!containerUid || !containerObj) return
    let elObj = containerObj.elements[Uid]
    let el = elObj.el
    if (!el) return
    el.handler = {}
    el.handler.load = () => {
      el.style.opacity = 1
      el.removeAttribute(`data-${UID_EXT}`)
      if (elObj) {
        delete lazyLoad[containerUid].elements[Uid]
      }
    }
    el.addEventListener('load', el.handler.load)
    if (isVisible(container, el)) {
      readyToLoad(el, containerUid, true)
    } else {
      readyToLoad(el, containerUid)
    }
  },
  readyToLoad (el, containerUid, whetherLoad) {
    let Uid = getUid(el)
    let elObj = lazyLoad[containerUid].elements[Uid]
    if (whetherLoad) {
      el.setAttribute('src', elObj.binding.value)
    }
    el.style.backgroundColor = '#fff'
    el.style.transition = `opacity ${SPEED}`
    el.style.backgroundColor = '#fff'
  }
}



