// ==UserScript==
// @name         abookmark
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author
// @match        https://*/*
// @match        http://*/*

// ==/UserScript==

;(function () {
  'use strict'
  if (location.href === 'http://localhost:8080/') return
  var script = document.createElement('script')
  script.src = 'http://localhost:8080/app.bundle.js'
  document.body.appendChild(script)
})()
