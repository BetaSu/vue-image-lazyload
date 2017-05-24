export default {
  throttle (func, wait) {
    var timeout, context, args, result
    let previous = 0
    let later = () => {
      previous = new Date().getTime()
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }
    return function () {
      context = this
      args = arguments
      let now = new Date().getTime()
      if (!previous) previous = now
      let remaining = wait - (now - previous)
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        previous = now
        result = func.apply(context, args)
        if (!timeout) context = args = null
      } else {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(later, remaining)
      }
      return result
    }
  }
}
