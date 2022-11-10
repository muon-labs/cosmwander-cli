import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/ScreenContext'
import fs from 'fs'
import { getCWD } from '../utils/fileUtils'

const Contracts = ({}) => {
  const { width, height, contract, setContract } = useAppContext()
  const [contracts, setContracts] = useState<string[]>([])
  const [err, setErr] = useState('')

  useEffect(() => {
    const rootPath = getCWD()
    const contractsPath = `${rootPath}/contracts`
    const files = fs.readdir(contractsPath, (err, files) => {
      if (err) {
        console.log(err)
        setErr(err.message)
      } else {
        setErr('')
        // set where file is not a directory && cargo.toml exists
        setContracts(
          files.filter(
            file =>
              fs.lstatSync(`${contractsPath}/${file}`).isDirectory() &&
              fs.existsSync(`${contractsPath}/${file}/Cargo.toml`)
          )
        )
      }
    })
  }, [])

  useEffect(() => {
    console.log({ width, height })
  }, [width, height])

  return (
    <box
      label=' contracts '
      border={{ type: 'line' }}
      top={0}
      height={'100%'}
      width={'100%'}
    >
      {err ? (
        <text style={{ fg: 'red' }}>{err}</text>
      ) : (
        contracts.map((c, i) => {
          return (
            <button
              mouse
              // @ts-ignore
              onPress={() => setContract(c)}
              key={c}
              top={i * 3}
              height={c === contract ? 4 : 3}
              bg={c === contract ? 'white' : 'transparent'}
              border={
                c === contract ? { type: 'bg', bg: 'white' } : { type: 'line' }
              }
            >
              {/* {`${c}${c === contract ?'\n └1':''}`} */}
              {`${c}`}
            </button>
          )
        })
      )}

      {/* <text
        bg='white'
        style={{ bg: 'white' }}
      >{`width: ${width} height: ${height}`}</text> */}
    </box>
  )
}

export default Contracts
