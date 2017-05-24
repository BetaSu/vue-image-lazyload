import _ from './utils'
import Vue from 'vue'

const UID_EXT = 'Uid'
const SPEED = '2s'
const EXE_TIMEOUT = 600

const setUid = (el, binding, container) => {
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
}

const getUid = (el) => {
  return el.getAttribute(`data-${UID_EXT}`)
}

const isVisible = (container, ele) => {
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
}

const checkImage = container => {
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
}

const addImg = (container, Uid) => {
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
}

const readyToLoad = (el, containerUid, whetherLoad) => {
  let Uid = getUid(el)
  let elObj = lazyLoad[containerUid].elements[Uid]
  if (whetherLoad) {
    el.setAttribute('src', elObj.binding.value)
  }
  el.style.backgroundColor = '#fff'
  el.style.transition = `opacity ${SPEED}`
  el.style.backgroundColor = '#fff'
}

let lazyLoad = {}
lazyLoad.install = () => {
  Vue.directive('lazyContainer', {
    inserted (el, binding) {
      setUid(el, binding)
      const checkImageProxy = _.throttle(() => {
        checkImage(el)
        }, EXE_TIMEOUT)
      el._checkImage = checkImageProxy
      el.addEventListener('scroll', checkImageProxy)
      el.addEventListener('resize', checkImageProxy)
    },
    unbind (el) {
      el.removeEventHandler('scroll', el._checkImage)
      el.removeEventHandler('resize', el._checkImage)
      delete el._checkImage
      delete lazyLoad[getUid(el)]
      el.removeAttribute(`data-${UID_EXT}`)
    }
  })
  Vue.directive('lazySrc', {
    inserted (el, binding) {
      Vue.nextTick(() => {
        const findContainer = ele => {
        let _parent = ele.parentNode || ele.parentElement
        if (_parent && _parent.nodeType === 1 && _parent.getAttribute(`data-${UID_EXT}`)) {
          setUid(el, binding, _parent)
          addImg(_parent, getUid(el))
      } else {
          findContainer(_parent)
      }
    }
        findContainer(el)
    })
    },
    unbind (el) {
      el.removeEventListener('load', el.handler.load)
      delete el.handler
      delete el._parent
    }
  })
}

export default lazyLoad


