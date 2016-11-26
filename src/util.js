const path = require('path')
const spawn = require('child_process').spawn

function runOsacript(script, cwd) {
  cwd = cwd || process.cwd()
  const run = spawn('osascript', {cwd: cwd})
  run.stdout.on('data', () => {})
  run.stdin.write(script)
  run.stdin.end()
  run.on('error', err => {
    console.log(`Failed to run osascript ${err.message}`)
  })
}

exports.focusEditor = function focusEditor() {
  const element = document.getElementById('neoclide-editor')
  if (!element) throw new Error('neoclide-editor element not found')
  const editor = element.editor
  if (!editor.state.focused) editor.focus()
}

exports.openIterm = function (full_path, isFile) {
  let dir = isFile ? path.dirname(full_path) : full_path
  const osascript  = `
if application "iTerm" is not running then
	tell application "iTerm"
		activate
		delay 0.2
	end tell
end if
tell application "iTerm"
	create window with default profile
	tell current window
		tell current session
			write text "cd ${dir}"
			write text "clear"
		end tell
	end tell
end tell
`
  runOsacript(osascript, dir)
}

exports.getClient = function () {
  const element = document.getElementById('neoclide-editor')
  const editor = element.editor
  return editor.getClient()
}
