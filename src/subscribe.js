// subscibe events from neovim
const electron = require('electron')
const component_loader = require('./loader')
const currentWin = electron.remote.getCurrentWindow()

module.exports = function (runtime) {

  runtime.subscribe('neoclide:load-path', html_path => {
    component_loader.loadComponent(html_path)
  })

  runtime.subscribe('neoclide:load-plugin-dir', dir_path => {
    component_loader.loadPluginDir(dir_path)
  })

  runtime.subscribe('neoclide:edit-start', file_path => {
    currentWin.setRepresentedFilename(file_path)
    electron.remote.app.addRecentDocument(file_path)
  })

  runtime.subscribe('neoclide:reload', () => {
    currentWin.reload()
  })

  runtime.subscribe('neoclide:append-script-file', script_path => {
    let script = document.createElement('script')
    script.src = script_path
    document.body.appendChild(script_path)
  })

  runtime.subscribe('neoclide:open-devtools', mode => {
    const contents = electron.remote.getCurrentWebContents()
    contents.openDevTools({ mode })
  })

  runtime.subscribe('neoclide:execute-javascript', code => {
    if (typeof code !== 'string') {
      console.error('neoclide:execute-javascript: Not a string', code)
      return
    }
    try {
      eval(code)
    }
    catch (e) {
      console.error('While executing javascript:', e, ' Code:', code)
    }
  })

  runtime.subscribe('neoclide:browser-window', (method, args) => {
    try {
      currentWin[method](...args)
    }
    catch (e) {
      console.error("Error while executing 'neoclide:browser-window':", e, ' Method:', method, ' Args:', args)
    }
  })
  runtime.subscribe('neoclide:tabs-changed', args => {
    console.log(args)
  })
}
