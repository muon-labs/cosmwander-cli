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

function defaultSetter () {}

export interface SpawnCommand {
  command: string
  args: string[]
  cwd: string
}

const AppContext = createContext({
  width: 0 as TPosition,
  height: 0 as TPosition,
  contract: '' as string,
  env: 'testnet' as string,
  command: undefined as SpawnCommand | undefined,
  setWidth: defaultSetter as Dispatch<SetStateAction<TPosition>>,
  setHeight: defaultSetter as Dispatch<SetStateAction<TPosition>>,
  setContract: defaultSetter as Dispatch<SetStateAction<string>>,
  setEnv: defaultSetter as Dispatch<SetStateAction<string>>,
  setCommand: defaultSetter as Dispatch<
    SetStateAction<SpawnCommand | undefined>
  >
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
  const [contract, setContract] = useState<string>('')
  const [env, setEnv] = useState<string>('testnet')
  const [command, setCommand] = useState<SpawnCommand | undefined>(undefined)

  useEffect(() => {
    setWidth(screen.width)
    setHeight(screen.height)

    screen.on('resize', newScreen => {
      console.log({ newScreen })
      setWidth(screen.width)
      setHeight(screen.height)
    })
  }, [])

  let sharedState = {
    width,
    setWidth,
    height,
    setHeight,
    contract,
    setContract,
    env,
    setEnv,
    command,
    setCommand
  }

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  )
}

export function useAppContext () {
  return useContext(AppContext)
}
