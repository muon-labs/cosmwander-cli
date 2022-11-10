import React, { EffectCallback, useEffect, useRef, useState } from 'react'
import { TPosition } from '../utils/types'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { WriteStream } from 'fs'
import FromStream from '../utils/FromStream'
import { SpawnCommand, useAppContext } from '../context/ScreenContext'

let outs: {
  [key: string]: ChildProcessWithoutNullStreams
}
function hashCommand (command: string, args: string[], cwd: string) {
  return `${command}${args.join('')}${cwd}`
}
function spawnOrGetFunction (command: string, args: string[], cwd: string) {
  const hash = hashCommand(command, args, cwd)
  if (outs[hash]) return outs[hash]
  outs[hash] = spawn(command, args, { cwd: cwd })
  return outs[hash]
}

const Logs = ({ height, top }: { height: TPosition; top: TPosition }) => {
  const { command, setCommand } = useAppContext()
  const [output, setOutput] = useState('')

  const logBoxRef = useRef(null)

  useEffect(() => {
    if (command) {
      setOutput('')
      let out = spawnOrGetFunction(command.command, command.args, command.cwd)

      attachListeners(out)
      return () => removeListeners(out)
    }
  }, [command])

  function attachListeners (out: any) {
    out.stdout.on('data', handler)
    out.stderr.on('data', handler)
    out.stderr.on('close', closeHandler)
  }

  function removeListeners (out: any) {
    out.stdout.off('data', handler)
    out.stderr.off('data', handler)
    out.stderr.off('close', closeHandler)
  }

  function handler (data: any) {
    setOutput(output + data.toString())
    // @ts-ignore
    logBoxRef.current?.setScrollPerc(100)
  }

  function closeHandler () {
    // if (command) {
    //   const hash = hashCommand(command.command, command.args, command.cwd)
    //   setTimeout(() => {
    //     delete outs[hash]
    //   }, 100)
    // }
    setCommand(undefined)
  }

  useEffect(() => {
    if (command) {
      let out = spawnOrGetFunction(command.command, command.args, command.cwd)
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
