// subscribe events from neovim client
class RuntimeApi {
  constructor(client) {
    this._callbacks = {}
    this.client = client
    client.on('notification', this.call.bind(this))
  }

  subscribe(name, callback) {
    this.client.subscribe(name)
    let cbs = this._callbacks[name] || []
    cbs.push(callback)
    this._callbacks[name] = cbs
  }

  unsubscribe(name, callback) {
    if (name == null && callback == null) {
      for (const name in this._callbacks) {
        this.client.unsubscribe(name)
      }
    } else if (callback == null) {
      this.client.unsubscribe(name)
    } else {
      let cbs = this._callbacks[name] || []
      let idx = cbs.indexOf(callback)
      if (idx == -1) return
      cbs.splice(idx, 1)
    }
  }

  call(func_name, args) {
    const cbs = this._callbacks[func_name]
    if (!cbs) return null
    console.log('call(): ', func_name, args)
    cbs.forEach(cb => {
      cb.apply(cb, args)
    })
  }
}

module.exports = RuntimeApi
