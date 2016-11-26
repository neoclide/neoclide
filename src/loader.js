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
    const plugin_dir = path.join(dir, 'neoclide-plugin')
    try {
      for (let _i = 0, _a = fs.readdirSync(plugin_dir); _i < _a.length; _i++) {
        const entry = _a[_i]
        if (entry.endsWith('.html')) {
          this.loadComponent(path.join(plugin_dir, entry))
        }
      }
      this.neoclide_plugin_paths.push(dir)
    }
    catch (err) {
    }
  }

  loadFromRTP(runtimepaths) {
    for (let _i = 0, runtimepaths_1 = runtimepaths; _i < runtimepaths_1.length; _i++) {
      const rtp = runtimepaths_1[_i]
      this.loadPluginDir(rtp)
    }
  }
}

module.exports = new ComponentLoader()
