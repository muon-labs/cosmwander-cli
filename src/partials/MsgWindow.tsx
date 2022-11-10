import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/ScreenContext'
import { TPosition } from '../utils/types'
import fs from 'fs'
import {
  formatWithUnderscores,
  getContractDetails,
  getContractDirectory,
  getCWD
} from '../utils/fileUtils'
import { getCenterColWidth } from '../utils/windowUtils'

const MsgWindow = ({ height }: { height: TPosition }) => {
  const { contract, command, setCommand, width } = useAppContext()
  const [contractDetails, setContractDetails] = useState<{
    wasm: fs.Stats | null
    optimized: fs.Stats | null
  }>()

  useEffect(() => {
    if (contract) {
      try {
        setContractDetails(getContractDetails(formatWithUnderscores(contract)))
      } catch (e) {
        console.log(e)
      }
    }
  }, [contract, command])

  function handleBuildWasm () {
    setCommand({
      command: 'cargo',
      args: ['build', '--release', '--target=wasm32-unknown-unknown'],
      cwd: getContractDirectory(contract)
    })
  }

  const centerColWidth = getCenterColWidth(width as number)
  const buttonLeft = Math.max(centerColWidth * 0.5, 20)

  const detailTextLines = [
    'Last WASM build:',
    contractDetails?.wasm ? contractDetails.wasm.mtime.toDateString() : '',
    contractDetails?.wasm ? contractDetails.wasm.mtime.toTimeString() : '',
    '',
    'Last optimized build:',
    contractDetails?.optimized
      ? contractDetails.optimized.mtime.toDateString()
      : '',
    contractDetails?.optimized
      ? contractDetails.optimized.mtime.toTimeString()
      : ''
  ]

  const detailText = detailTextLines.join('\n')

  return (
    <box
      label={contract || ' msg '}
      border={{ type: 'line' }}
      top={0}
      height={height}
      width={'100%'}
    >
      {contract && (
        <>
          <text top={1} left={1}>
            {detailText}
          </text>
          {contractDetails?.wasm && (
            <button
              border={{ type: 'line' }}
              top={1}
              height={3}
              width={15}
              left={buttonLeft}
            >
              Upload WASM
            </button>
          )}
          {contractDetails?.optimized && (
            <button
              border={{ type: 'line' }}
              top={6}
              height={3}
              width={15}
              left={buttonLeft}
            >
              Upload Opt
            </button>
          )}
          <button
            top={detailTextLines.length + 2}
            left={1}
            height={3}
            width={18}
            border={{ type: 'line' }}
            mouse
            // @ts-ignore
            onPress={handleBuildWasm}
          >
            Build WASM
          </button>
          <button
            top={detailTextLines.length + 2}
            left={1 + 18 + 1}
            height={3}
            width={18}
            border={{ type: 'line' }}
          >
            Build Optimized
          </button>
        </>
      )}
    </box>
  )
}

//└
export default MsgWindow
