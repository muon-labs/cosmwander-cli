import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/ScreenContext'

const Debug = ({}) => {
  const { width, height } = useAppContext()

  useEffect(() => {
    console.log({ width, height })
  }, [width, height])

  return (
    <box
      label=' debug '
      border={{ type: 'line' }}
      bottom={0}
      right={0}
      height={3}
      width={40}
    >
      <text>{`width: ${width} height: ${height}`}</text>
    </box>
  )
}

export default Debug
