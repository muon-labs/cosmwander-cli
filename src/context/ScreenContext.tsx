import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import { TPosition } from '../utils/types'
import blessed from 'blessed'
import { saveMeta } from '../utils/fileUtils'

function defaultSetter () {}

export interface SpawnCommand {
  command: string
  args: string[]
  cwd: string
  env?: { [key: string]: string }
  callback?: (output: string) => void
}

export interface MsgMetadata {
  title: string
  msg: string
}

export interface ContractInstanceMetadata {
  address: string
}

export interface CodeMetadata {
  codeID: string
  deployedContracts: ContractInstanceMetadata[]
}

export interface ContractMetadata {
  fileName: string
  buildName: string // same as filename generally but with underscores
  codes: CodeMetadata[]
  initMsgs: MsgMetadata[]
  executeMsgs: MsgMetadata[]
  queryMsgs: MsgMetadata[]
}

const AppContext = createContext({
  width: 0 as TPosition,
  height: 0 as TPosition,
  contract: null as ContractMetadata | null,
  codeId: '' as string,
  contractInstanceAddress: '' as string,
  env: '' as string,
  command: undefined as SpawnCommand | undefined,
  logAppendContent: '' as string,
  setWidth: defaultSetter as Dispatch<SetStateAction<TPosition>>,
  setHeight: defaultSetter as Dispatch<SetStateAction<TPosition>>,
  setContract: defaultSetter as Dispatch<
    SetStateAction<ContractMetadata | null>
  >,
  setCodeId: defaultSetter as Dispatch<SetStateAction<string>>,
  setContractInstanceAddress: defaultSetter as Dispatch<SetStateAction<string>>,
  setEnv: defaultSetter as Dispatch<SetStateAction<string>>,
  setCommand: defaultSetter as Dispatch<
    SetStateAction<SpawnCommand | undefined>
  >,
  log: (..._args: any[]) => {}
})

export function AppWrapper ({
  screen,
  children
}: {
  screen: blessed.Widgets.Screen
  children?: any
}) {
  const [width, setWidth] = useState<TPosition>(0)
  const [height, setHeight] = useState<TPosition>(0)
  const [contract, setContract] = useState<ContractMetadata | null>(null)
  const [codeId, setCodeId] = useState<string>('')
  const [contractInstanceAddress, setContractInstanceAddress] = useState<
    string
  >('')
  const [env, setEnv] = useState<string>('testnet')
  const [command, setCommand] = useState<SpawnCommand | undefined>(undefined)
  const [logAppendContent, setLogAppendContent] = useState<string>('')

  useEffect(() => {
    setWidth(screen.width)
    setHeight(screen.height)

    screen.on('resize', newScreen => {
      console.log({ newScreen })
      setWidth(screen.width)
      setHeight(screen.height)
    })
  }, [])

  useEffect(() => {
    if (contract && contract.fileName && env) {
      saveMeta(contract, env)
    }
  }, [contract])

  let sharedState = {
    width,
    setWidth,
    height,
    setHeight,
    contract,
    setContract,
    codeId,
    setCodeId,
    contractInstanceAddress,
    setContractInstanceAddress,
    env,
    setEnv,
    command,
    setCommand,
    logAppendContent,
    log: (...args: string[]) => {
      setLogAppendContent(
        args
          .map(a => {
            if (typeof a === 'object') return JSON.stringify(a)
            return a
          })
          .join(' ') + '\n'
      )
    }
  }

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  )
}

export function useAppContext () {
  return useContext(AppContext)
}
