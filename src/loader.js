const path = require('path')
const fs = require('fs')

// load neoclide plugins from paths
class ComponentLoader {
  constructor() {
    this.initially_loaded = false
    this.component_paths = []
  }

  loadComponent(path) {
    const link = document.createElement('link')
    link.rel = 'import'
    link.href = path
    document.head.appendChild(link)
    this.component_paths.push(path)
  }

  loadPluginDir(dir) {
    const htmlFile = path.join(dir, 'neoclide/index.html')
    try {
      let stat = fs.stasSync(htmlFile)
      if (stat.isFile()) this.loadComponent(htmlFile)
    } catch(e) { }
  }

  loadFromRTP(runtimepaths) {
    runtimepaths.forEach(path => {
      this.loadPluginDir(path)
    })
  }
}

module.exports = new ComponentLoader()
