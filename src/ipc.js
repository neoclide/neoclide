// suscribe events from main process
const electron = require('electron')
const util = require('./util')
const currWin = electron.remote.getCurrentWindow()
const {clipboard} = require('electron')

module.exports = function (editor) {
  const client = editor.getClient()
  const state = editor.state

  electron.ipcRenderer.on('neoclide:exec-commands', (_, cmds) => {
    util.focusEditor()
    if (state.mode != 'normal') client.input('<Esc>')
    for (let _i = 0, cmds_1 = cmds; _i < cmds_1.length; _i++) {
      const c = cmds_1[_i]
      client.command(c)
    }
  })

  electron.ipcRenderer.on('neoclide:tab-edit', () => {
    util.focusEditor()
    if (state.mode != 'normal') client.input('<Esc>')
    client.command('tabe')
  })

  electron.ipcRenderer.on('neoclide:choose-files-open', (_, paths) => {
    util.focusEditor()
    if (state.mode != 'normal') client.input('<Esc>')
    paths.forEach(path => {
      client.command(`tab drop ${path}`)
    })
  })

  electron.ipcRenderer.on('neoclide:reload', () => {
    // required to cleanup some plugin
    client.command('silent doautocmd <nomodeline> VimLeavePre').then(() => {
      client.command('silent doautocmd <nomodeline> VimLeave').then(() => {
        currWin.reload()
      })
    })
  })

  electron.ipcRenderer.on('neoclide:quit-app', () => {
    client.quit()
  })

  electron.ipcRenderer.on('neoclide:tab-open', (_, index) => {
    util.focusEditor()
    if (state.mode != 'normal') client.input('<Esc>')
    client.input(`${index}gt`)
  })

  electron.ipcRenderer.on('neoclide:quit-window', () => {
    util.focusEditor()
    if (state.mode != 'normal') client.input('<Esc>')
    client.command('q!')
  })

  electron.ipcRenderer.on('neoclide:save-all-files', () => {
    util.focusEditor()
    if (state.mode != 'normal') client.input('<Esc>')
    client.command('wa')
  })

  electron.ipcRenderer.on('neoclide:tab-close', () => {
    util.focusEditor()
    if (state.mode != 'normal') client.input('<Esc>')
    client.listTabpages().then(pages => {
      if (pages.length <= 1) return
      client.command('tabc')
    })
  })

  electron.ipcRenderer.on('neoclide:tab-close-all', () => {
    util.focusEditor()
    if (state.mode != 'normal') client.input('<Esc>')
    client.command('tabo')
  })

  electron.ipcRenderer.on('neoclide:copy', () => {
    client.eval('mode()').then(value => {
      if (value.length === 0) {
        return
      }
      const ch = value[0]
      const code = value.charCodeAt(0)
      if (ch === 'v'
        || ch === 'V'
        || code === 22) {
          client.input('"+y')
      }
    })
  })

  electron.ipcRenderer.on('neoclide:select-all', () => {
    client.eval('mode()').then(value => {
      if (value.length === 0) {
        return
      }
      const command = value[0] === 'n' ? 'ggVG' : '<Esc>ggVG'
      client.input(command)
    })
  })

  electron.ipcRenderer.on('neoclide:cut', () => {
    client.eval('mode()').then(value => {
      if (value.length === 0) {
        return
      }
      const ch = value[0]
      const num = value.charCodeAt(0)
      if (ch === 'v'
        || ch === 'V'
        || num === 22) {
          client.input('"+x')
      }
    })
  })

  electron.ipcRenderer.on('neoclide:paste', () => {
    client.eval('mode()').then(value => {
      if (value.length === 0) {
        return
      }
      let command
      const ch = value[0]
      const code = value.charCodeAt(0)
      // TODO fix paste not working on commandline
      if (ch === 'v') {
        command = '"_d"+P'
      }
      else if (ch === 'V') {
        command = '"_d"+p'
      }
      else if (code === 22 || ch === 'n') {
        command = '"+]p'
      }
      else if (ch === 'i') {
        command = ''
        const content = clipboard.readText()
        client.setOption('paste', true).then(() => {
          client.feedkeys(content, 'n', true).then(() => {
            client.setOption('paste', false)
          }, () => {
            client.setOption('paste', false)
          })
        })
        //client.command('call feedkeys("abc")')
      }
      else if (ch === 'c') {
        command = ''
        client.input('<C-r>+')
      }
      if (command) {
        client.command(`execute 'normal! ${command}'`)
      }
    })
  })
}
