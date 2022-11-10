import React, { useState } from 'react'
import { TPosition } from '../utils/types'

const envConfigs = [
  {
    displayName: 'Osmosis Testnet',
    chainId: 'osmo-test-4',
    node: 'https://testnet-rpc.osmosis.zone:443'
  },
  {
    displayName: 'Quasar Localnet',
    chainId: 'quasar',
    node: 'http://localhost:26657'
  }
]

const EnvList = ({ height }: { height: TPosition }) => {
  return (
    <box
      label=' environments '
      border={{ type: 'line' }}
      top={0}
      right={0}
      height={height}
      width={'100%'}
    >
      {envConfigs.map((conf, i) => {
        return (
          <button
            key={conf.chainId}
            top={i * 3}
            height={3}
            border={{ type: 'line' }}
          >
            <text left='center'>{` ${conf.displayName} `}</text>
          </button>
        )
      })}
    </box>
  )
}

export default EnvList
