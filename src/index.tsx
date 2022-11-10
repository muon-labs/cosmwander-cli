import blessed from 'blessed'
import React from 'react'
import { render } from 'react-blessed'
import App from './App'
import { AppWrapper } from './context/ScreenContext'

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed hello world'
})

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0)
})

// Rendering the React app using our screen
render(
  <AppWrapper screen={screen}>
    <App />
  </AppWrapper>,
  screen
)
