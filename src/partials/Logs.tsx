import React, { EffectCallback, useEffect, useRef, useState } from 'react'
import { TPosition } from '../utils/types'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { WriteStream } from 'fs'
import FromStream from '../utils/FromStream'
import { SpawnCommand, useAppContext } from '../context/ScreenContext'

let currentCommandOutput = ''

let outs: {
  [key: string]: ChildProcessWithoutNullStreams
} = {}
function hashCommand (cmd: SpawnCommand) {
  return `${cmd.command}${cmd.args.join('')}${cmd.cwd}`
}
function spawnOrGetFunction (cmd: SpawnCommand) {
  const hash = hashCommand(cmd)
  if (outs[hash]) return outs[hash]
  outs[hash] = spawn(cmd.command, cmd.args, { cwd: cmd.cwd, env: cmd.env })
  return outs[hash]
}

const Logs = ({ height, top }: { height: TPosition; top: TPosition }) => {
  const { command, setCommand, logAppendContent, log } = useAppContext()
  const [output, setOutput] = useState('')

  const logBoxRef = useRef(null)

  useEffect(() => {
    // new command entrypoint
    if (command) {
      let out = spawnOrGetFunction(command)

      attachListeners(out)
      return () => removeListeners(out)
    }
  }, [command])

  useEffect(() => {
    setOutput(output + logAppendContent )
    scrollToBottom()
  }, [logAppendContent])

  function appendHandler (data: any) {
    setOutput(output + data.toString())
    currentCommandOutput += data.toString()
    scrollToBottom()
  }

  function closeHandler () {
    const savedOutput = (' ' + currentCommandOutput).slice(1)
    // log('here1')
    // log(savedOutput)
    // log('here2')
    setTimeout(() => {
      if (command?.callback) command?.callback(savedOutput)
    }, 100)
    // reset
    setCommand(undefined)
    currentCommandOutput = ''
    if (command) {
      const hash = hashCommand(command)
      delete outs[hash]
    }
  }

  function attachListeners (out: any) {
    out.stdout.on('data', appendHandler)
    out.stderr.on('data', appendHandler)
    out.stderr.on('close', closeHandler)
  }

  function removeListeners (out: any) {
    out.stdout.off('data', appendHandler)
    out.stderr.off('data', appendHandler)
    out.stderr.off('close', closeHandler)
  }

  function scrollToBottom () {
    // @ts-ignore
    logBoxRef.current?.setScrollPerc(100)
  }

  useEffect(() => {
    if (command) {
      let out = spawnOrGetFunction(command)
      attachListeners(out)
      return () => removeListeners(out)
    }
  }, [output])

  return (
    <box
      label={
        command ? ` ${command.command} ${command.args.join(' ')} ` : ' logs '
      }
      ref={logBoxRef}
      border={{ type: 'line' }}
      height={height}
      top={top}
      width={'100%'}
      mouse
      scrollable
      style={{
        scrollbar: {
          bg: 'blue',
          fg: 'red',
          track: {
            bg: 'cyan',
            fg: 'magenta'
          }
        }
      }}
    >
      {output}
    </box>
  )
}

export default Logs
