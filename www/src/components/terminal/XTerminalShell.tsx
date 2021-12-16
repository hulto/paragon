import React, { Component } from 'react'
import Terminal from 'react-console-emulator'

const commands = {
  echo: {
    description: 'Echo a passed string.',
    usage: 'echo <string>',
    fn: function () {
      return `${Array.from(arguments).join(' ')}`
    }
  }
}

function sendCommand(cmdString){
  // Do the remote stuff.
  return "cmd output"
}

export default class XTerminalShell extends Component {
  render () {
    return (
      <Terminal
        welcomeMessage={'Welcome to the React terminal!'}
        promptLabel={'me@React:~$'}
        commandCallback={result => console.log(sendCommand(result))}
        />
    )
  }
}
