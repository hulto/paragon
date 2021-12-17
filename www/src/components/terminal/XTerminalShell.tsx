import React, { Component } from 'react'
import Terminal from 'react-console-emulator'
import { Target } from "../../graphql/models";

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


const XTerminalShell = ({t}) => (
  <Terminal
  welcomeMessage={'Welcome to the React terminal!'}
  promptLabel={'me@'+t+':~$'}
  commandCallback={result => console.log(t)}
  />
)
export default XTerminalShell;