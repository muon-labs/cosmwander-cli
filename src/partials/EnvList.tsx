import React, { useState } from 'react'
import { TPosition } from '../utils/types'

const EnvList = ({ height }: { height: TPosition }) => {
  return (
    <box
    label=' environments '
      border={{ type: 'line' }}
      top={0}
      right={0}
      height={height}
      width={'100%'}
    ></box>
  )
}

export default EnvList
