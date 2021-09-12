const Storage = {
  set (key, val) {
    if (typeof val === 'object') {
      JSON.stringify(val)
    }
    window.localStorage.setItem(key, val)
  },
  get (key) {
    return window.localStorage.getItem(key)
  },
  remove (key, val) {
    window.localStorage.removeItem(key.val)
  }
}
export default Storage
