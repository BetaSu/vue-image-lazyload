import _ from './utils'
import methods from './lazy-load'
import Vue from 'vue'

let lazyLoad = {}
lazyLoad.install = () => {
  Vue.directive('lazyContainer', {
    inserted (el, binding) {
      methods.setUid(el, binding)
      const checkImageProxy = _.throttle(() => {
        methods.checkImage(el)
        }, EXE_TIMEOUT)
      el._checkImage = checkImageProxy
      el.addEventListener('scroll', checkImageProxy)
      el.addEventListener('resize', checkImageProxy)
    },
    unbind (el) {
      el.removeEventHandler('scroll', el._checkImage)
      el.removeEventHandler('resize', el._checkImage)
      delete el._checkImage
      delete lazyLoad[methods.getUid(el)]
      el.removeAttribute(`data-${UID_EXT}`)
    }
  })
  Vue.directive('lazySrc', {
    inserted (el, binding) {
      Vue.nextTick(() => {
        const findContainer = ele => {
        let _parent = ele.parentNode || ele.parentElement
        if (_parent && _parent.nodeType === 1 && _parent.getAttribute(`data-${UID_EXT}`)) {
          methods.setUid(el, binding, _parent)
          methods.addImg(_parent, getUid(el))
      } else {
          methods.findContainer(_parent)
      }
    }
        methods.findContainer(el)
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


