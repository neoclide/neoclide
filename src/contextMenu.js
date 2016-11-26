const {remote, shell} = require('electron')
const {Menu, MenuItem, dialog} = remote
const util = require('./util')
const currWin = remote.getCurrentWindow()

let curr_file
let is_file

const menu = new Menu()

menu.append(new MenuItem({
  label: 'Rename',
  click() {
    // TODO rename file
    console.log(`Rename ${curr_file}`)
  }
}))

menu.append(new MenuItem({
  label: 'Delete',
  click() {
    dialog.showMessageBox(currWin, {
      type: 'warning',
      buttons: ['Move to Trash', 'Cancel'],
      message: `You are deleting:\n${curr_file}`
    }, (number) => {
      if (number == 1) return
      shell.moveItemToTrash(curr_file)
      util.focusEditor()
    })
  }
}))

const splitItem = new MenuItem({
  label: 'Split open',
  click() {
    if (!is_file) return
    const client = util.getClient()
    client.command(`vs ${curr_file}`).then(() => {
      util.focusEditor()
    })
  }
})

menu.append(splitItem)

menu.append(new MenuItem({
  type: 'separator'
}))

menu.append(new MenuItem({
  label: 'New File',
  click() {
    console.log(`New file ${curr_file}`)
    //TreeView.createFile(curr_file)
    // TODO create new file
  }
}))

menu.append(new MenuItem({
  label: 'New Folder',
  click() {
    console.log(`New folder ${curr_file}`)
    // TODO create new folder
    //TreeView.createFolder(curr_file)
  }
}))

menu.append(new MenuItem({
  label: 'Add Project Folder',
  click() {
    //TreeView.addProjectFolder()
    // TODO add project folder
  }
}))

menu.append(new MenuItem({
  type: 'separator'
}))

menu.append(new MenuItem({
  label: 'Open Folder Here',
  click() {
    shell.showItemInFolder(curr_file)
  }
}))

if (process.platform == 'darwin') {
  menu.append(new MenuItem({
    label: 'Open iTerm Here',
    click() {
      util.openIterm(curr_file, is_file)
    }
  }))
}

module.exports =  function (file, isFile) {
  curr_file = file
  is_file = isFile
  if (isFile) {
    splitItem.visible = true
  } else {
    splitItem.visible = false
  }
  menu.popup(remote.getCurrentWindow())
}
