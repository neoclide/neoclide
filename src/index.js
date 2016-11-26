const Polymer = require('polymer')
const electron = require('electron')
const path = require('path')
const prepareIpc = require('./ipc')
const subscribe = require('./subscribe.js')
const Runtime = require('./runtime')
const ThisBrowserWindow = electron.remote.getCurrentWindow()
const component_loader = require('./loader')
const fs = require('fs')
const session_path = path.join(electron.remote.getGlobal('config_dir_path'), 'session.vim')
const runtime_path = electron.remote.getGlobal('neoclide_runtime')
const contextMenu = require('./contextMenu')

function checkSessionFile() {
  let stat
  try {
    stat = fs.statSync(session_path)
  } catch(e) {
    return false
  }
  return stat.isFile()
}

Polymer({
  is: 'neoclide-app',
  properties: {
    argv: {
      type: Array,
      value() {
        let electron_argc = 1
        let argv = electron.remote.process.argv
        if ('electron' === path.basename(argv[0]).toLowerCase()) {
          electron_argc += 1
        }
        if (/--debug/.test(argv[1])) {
          electron_argc += 1
        }

        const a = process.env.NEOCLIDE_E2E_TEST_RUNNING ? [] : argv.slice(electron_argc)
        const useDefault = a.length === 0
        a.unshift('--cmd', `let g:neoclide_version="${electron.remote.app.getVersion()}"`, '--cmd', `set rtp+=${runtime_path.replace(' ', '\ ')}`)
        a.unshift('-n')
        if (useDefault && checkSessionFile()) a.unshift('-S', session_path)
        return a
      },
    },
    editor: Object,
  },
  ready() {
    const element = document.getElementById('neoclide-editor')
    const editor = element.editor
    editor.on('error', err => alert(err.message))
    editor.on('quit', () => {
      ThisBrowserWindow.close()
    })
    this.editor = editor
    editor.on('beep', () => electron.shell.beep())
    editor.on('change title', title => {
      document.title = title
    })
    editor.on('change icon', iconPath => {
      // TODO set iconPath to electron
    })
    editor.on('contextmenu', () => {
      const client = editor.getClient()
      client.commandOutput('echo expand("%:p")').then(result => {
        let file = result.trim()
        let isFile = file.length ? true : false
        file = file.length ? file : process.cwd()
        contextMenu(file, isFile)
      })
    })
    editor.on('attached', () => {
      const client = editor.getClient()
      const runtime = new Runtime(client)
      subscribe(runtime, editor)
      client.listRuntimePaths()
        .then(rtp => {
          component_loader.loadFromRTP(rtp)
          component_loader.initially_loaded = true
        })
      element.addEventListener('drop', e => {
        e.preventDefault()
        const f = e.dataTransfer.files[0]
        if (f) client.command(`tab drop ${f.path}`)
      })
      electron.remote.app.on('open-file', (e, p) => {
        e.preventDefault()
        client.command(`tab drop ${p}`)
      })
      prepareIpc(editor)
    })
    element.addEventListener('dragover', e => e.preventDefault())
    window.addEventListener('keydown', e => {
      if (e.keyCode === 0x1b && !editor.state.focused) {
        editor.focus()
      }
    })
  }
})
