 if (exists('g:loaded_neoclide_runtime') && g:loaded_neoclide_runtime)
    finish
endif

function! s:send_current_path(method) abort
  let p = expand('%:p')
  if filereadable(p)
    call rpcnotify(0, a:method, p)
  endif
endfunction

let s:mod_bufs = []

function! s:send_current_tabs()
  let arr = []
  let g:x = 1
  for i in range(tabpagenr('$'))
    let nr = i + 1
    let item = {}
    let item.tabnr = nr
    let buflist = tabpagebuflist(nr)
    let winnr = tabpagewinnr(nr)
    let active_buf = buflist[winnr - 1]

    let item.modified = 0
    for bufnr in buflist
      if (getbufvar(bufnr, '&mod'))
        let item.modified = 1
      endif
    endfor
    let item.filetype = getbufvar(active_buf, '&filetype')
    let item.active = (nr == tabpagenr()) ? 1 : 0
    let item.full_path = fnamemodify(bufname(active_buf), ':p')
    call add(arr, item)
  endfor
  call rpcnotify(0, 'neoclide:tabs-changed', arr)
endfunction

function! s:save_session()
  if len(v:this_session)
    execute 'silent mksession!' v:this_session
  endif
endfunction

augroup neoclide
    autocmd!
    autocmd BufReadPost,BufNewFile * call <SID>send_current_path('neoclide:edit-start')
    autocmd VimLeavePre * call <SID>save_session()
    autocmd GUIEnter,BufEnter * call <SID>send_current_tabs()
augroup END

call s:send_current_path('neoclide:edit-start')

let g:loaded_neoclide_runtime = 1

