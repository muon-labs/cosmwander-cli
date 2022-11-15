import * as chalk from 'chalk'
import * as fs from 'fs'
import { useEffect, useState } from 'react'
import { ContractMetadata, useAppContext } from '../context/ScreenContext'
import { getCWD, loadMeta } from '../utils/fileUtils'

const Contracts = ({}) => {
  const {
    width,
    height,
    contract,
    setContract,
    codeId,
    setCodeId,
    contractInstanceAddress,
    setContractInstanceAddress,
    env,
    log
  } = useAppContext()
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

  function getContractDisplayHeight (c: string) {
    let contractDisplayHeight = 3
    if (contract?.fileName === c && contract.codes.length)
      contractDisplayHeight +=
        contract.codes.length +
        contract.codes.reduce((a, c) => a + c.deployedContracts.length, 0)
    return contractDisplayHeight
  }

  function setSelection (c: string, codeID: string, contractAddress: string) {
    log(`Setting contract to ${c} and codeID to ${codeID || 'undefined'}`)
    const meta = loadMeta(c, env)
    setContract(meta)

    if (codeID) setCodeId(codeID)
    else setCodeId('')

    if (contractAddress) setContractInstanceAddress(contractAddress)
    else setContractInstanceAddress('')
  }

  function getTopForContract (i: number) {
    return contracts.reduce((acc, c, j) => {
      if (j < i) {
        return acc + getContractDisplayHeight(c)
      }
      return acc
    }, 0)
  }

  function renderContract (c: string) {
    return (
      <button
        key={c}
        height={1}
        mouse
        // @ts-ignore
        onPress={() => setSelection(c, '')}
      >
        {`${c}`}
      </button>
    )
  }

  function renderActiveContract (
    c: string,
    cMeta: ContractMetadata,
    i: number
  ) {
    let render = [renderContract(`${!codeId ? chalk.inverse(c) : c}`)]

    if (contract?.fileName === c && contract.codes.length) {
      contract.codes.forEach((codeMeta, i) => {
        const codeIdText = `└ ${codeMeta.codeID}`

        render.push(
          <button
            mouse
            // @ts-ignore
            onPress={() => setSelection(c, codeMeta.codeID)}
            key={c + codeMeta.codeID}
            top={i + 1}
            height={1}
          >
            {codeId === codeMeta.codeID && !contractInstanceAddress
              ? chalk.inverse(codeIdText)
              : codeIdText}
          </button>
        )

        codeMeta.deployedContracts.forEach((contractInstance, j) => {
          const contractInstanceText = `  └ ${contractInstance.address.slice(
            0,
            8
          )}...${contractInstance.address.slice(-8)}`

          render.push(
            <button
              mouse
              // @ts-ignore
              onPress={() =>
                setSelection(c, codeMeta.codeID, contractInstance.address)
              }
              key={c + codeMeta.codeID + contractInstance.address}
              top={i + 1 + j + 1}
              height={1}
            >
              {contractInstance.address === contractInstanceAddress
                ? chalk.inverse(contractInstanceText)
                : contractInstanceText}
            </button>
          )
        })
      })
    }
    return render
  }

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
          let render
          if (contract?.fileName === c) {
            const cMeta = loadMeta(c, env)
            render = renderActiveContract(c, cMeta, i)
          } else {
            render = renderContract(c)
          }

          const top = getTopForContract(i)
          const height = getContractDisplayHeight(c)

          return (
            <box key={c} top={top} height={height} border={{ type: 'line' }}>
              {/* {`${c}${c === contract ?'\n └1':''}`} */}
              {render}
            </box>
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
