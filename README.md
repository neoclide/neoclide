![Neoclide](resources/neoclide-bar.png)
===================================

Neoclide is a rework of [Nyaovim](https://github.com/rhysd/NyaoVim), the reason is I want it have best user experience.

Neoclide is an editor built with web technologies while emebed with [neovim](https://github.com/neovim/neovim).

Neoclide is in early development, which means it could break easily, and **you should not take it seriously**.

Since I use Mac only, something could break on other platform, I need your help!

## What have done

* Global session save and restore
* Fixed copy/paste behaviour
* Fixed drag and click position calculate
* Fixed trigger of VimLeave event
* Background transparent support
* Improved input method support
* Improved cursor support
* Accessable editor state object
* Automatic resize handler, no screen blink

## How to use

Since it's in early age, no prebuild currently avaiable, you have to use it from souce code.

* Clone this repository
* Run following commands to install dependencies and build code

    ```
    npm run dep
    npm run build
    ```
* To start the app, use:

    ```
    npm run app
    ```



## LICENSE

Copyright 2016 chemzqm@gmail.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
