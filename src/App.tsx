import { useAppContext } from './context/ScreenContext'
import Contracts from './partials/Contracts'
import Debug from './partials/Debug'
import EnvList from './partials/EnvList'
import Logs from './partials/Logs'
import MsgWindow from './partials/MsgWindow'
import { IS_DEBUG } from './utils/config'
import { getCenterColWidth } from './utils/windowUtils'

// Rendering a simple centered box
const App = ({}) => {
  const { width, height } = useAppContext() as { width: number; height: number }

  const firstColWidth = Math.floor(Math.min(width * 0.3, 40))
  const secondColWidth = getCenterColWidth(width)
  const lastColWidth = Math.floor(Math.min(width * 0.3, 40))
  const secondColLeft = firstColWidth
  // const lastColLeft = firstColWidth + secondColWidth

  return (
    <element>
      {/* <box
          top='center'
          left='center'
          width='50%'
          height='50%'
          border={{ type: 'line' }}
          style={{ border: { fg: 'blue' } }}
        >
          
          <Counter />
          <text top={5}>hello govnahs</text>
        </box> */}
      {/* <Contracts maxWidth={40} width={'30%'} height={'100%'} /> */}
      <box width={firstColWidth} height={'100%'}>
        <Contracts />
      </box>
      <box left={secondColLeft} width={secondColWidth} height={'100%'}>
        <MsgWindow height={'50%'} />
        <Logs top={'50%'} height={'50%'} />
      </box>
      <box right={0} width={lastColWidth} height={'100%'}>
        <EnvList height={IS_DEBUG ? height - 3 : height} />
        {IS_DEBUG && <Debug />}
      </box>
    </element>
  )
}

export default App
