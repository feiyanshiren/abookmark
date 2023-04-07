import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

const bookApp = document.createElement('div')
bookApp.id = 'abookmark'
document.body.appendChild(bookApp)
ReactDOM.render(<App />, bookApp)
