// ==UserScript==
// @name         abookmark
// @namespace    abookmark
// @version      0.0.1
// @description  abookmark
// @author       sanyeshu
// @match        https://*/*
// @match        http://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @grant        GM_setValue
// @grant        GM_getValue
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/EasyUI@0.0.2/jquery.easyui.min.js


// ==/UserScript==

;(function () {
  'use strict'
  if (location.href === 'http://localhost:8080/') return
  var script = document.createElement('script')
  script.src = 'http://localhost:8080/app.bundle.js'
  document.body.appendChild(script)
})()
