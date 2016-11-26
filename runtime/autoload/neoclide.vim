function! neoclide#load_neoclide_plugin(runtimepath) abort
    call rpcnotify(0, 'neoclide:load-plugin-dir', a:runtimepath)
endfunction

function! neoclide#load_neoclide_plugin_direct(html_path) abort
    if a:html_path !~# '\.html$'
        throw 'neoclide: Invalid file name.  HTML file is expected.'
    endif
    call rpcnotify(0, 'neoclide:load-path', a:html_path)
endfunction

function! neoclide#require_javascript_file(script_path) abort
    if !filereadable(a:script_path)
        throw 'neoclide: Specified JavaScript code doesn''t exist: ' . a:script_path
    endif
    call rpcnotify(0, 'neoclide:append-script-file', a:script_path)
endfunction

function! neoclide#call_javascript_function(func_name, args) abort
    call rpcnotify(0, 'neoclide:call-global-function', a:func_name, a:args)
endfunction

function! neoclide#open_devtools(...) abort
    let mode = a:0 > 0 ? a:1 : 'detach'
    if index(['right', 'bottom', 'undocked', 'detach'], mode) == -1
        throw "neoclide: Invalid mode '" . mode . "' for DevTools.  Mode must be one of 'right', 'bottom', 'undocked' or 'detach'"
    endif
    call rpcnotify(0, 'neoclide:open-devtools', mode)
endfunction

" TODO:
" This function should return the result of JavaScript code using request
" instead of notification.
function! neoclide#execute_javascript(code) abort
    call rpcnotify(0, 'neoclide:execute-javascript', a:code)
endfunction

" TODO: Send request and get the return value
function! neoclide#browser_window(method, args) abort
    call rpcnotify(0, 'neoclide:browser-window', a:method, a:args)
endfunction
