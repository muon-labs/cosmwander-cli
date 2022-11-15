import React, { useState } from 'react'
import { useAppContext } from '../context/ScreenContext'
import { TPosition } from '../utils/types'

export interface EnvConfig {
  displayName: string
  chainId: string
  node: string
  command: string
  keyName: string
  feeAmount: string
  feeDenom: string
}

export const envConfigs: EnvConfig[] = [
  {
    displayName: 'Osmosis Testnet',
    chainId: 'osmo-test-4',
    node: 'https://testnet-rpc.osmosis.zone:443',
    command: 'osmosisd',
    keyName: 'bob',
    feeAmount: '10',
    feeDenom: 'uosmo'
  },
  {
    displayName: 'Quasar Localnet',
    chainId: 'quasar',
    node: 'http://localhost:26659',
    command: 'quasarnoded',
    keyName: 'alice',
    feeAmount: '10',
    feeDenom: 'uqsr'
  }
]

const EnvList = ({ height }: { height: TPosition }) => {
  const { env, setEnv } = useAppContext()

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
        const selected = env === conf.chainId ? '**' : ''
        return (
          <button
            key={conf.chainId}
            top={i * 3}
            height={3}
            border={{ type: 'line' }}
            mouse
            // @ts-ignore
            onPress={() => setEnv(conf.chainId)}
          >
            <text>{`${selected} ${conf.displayName} ${selected}`}</text>
          </button>
        )
      })}
    </box>
  )
}

export default EnvList
