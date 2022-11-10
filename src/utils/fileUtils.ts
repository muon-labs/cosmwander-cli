import fs from 'fs'
import { execSync } from 'child_process'

export function getCWD () {
  const rootPath =
    '/Users/nikitajerschow/Documents/PassiveIncome/CryptoBase/QuasarBase/quasar/smart-contracts'
  return rootPath
  // return process.cwd()
}

export function getFileDetails (filePath: string) {
  // find last modified date

  return fs.statSync(filePath)
}

export function getWasmArtifactsDetails (contract: string) {
  try {
    const filePath = `${getCWD()}/target/wasm32-unknown-unknown/release/${contract}.wasm`
    return getFileDetails(filePath)
  } catch (e) {
    return null
  }
}

export function getOptimizedArtifactsDetails (contract: string) {
  try {
    const filePath = `${getCWD()}/artifacts/${contract}.wasm`
    return getFileDetails(filePath)
  } catch (e) {
    return null
  }
}

export function getContractDetails (contract: string) {
  return {
    wasm: getWasmArtifactsDetails(contract),
    optimized: getOptimizedArtifactsDetails(contract)
  }
}

export function formatWithUnderscores (contract: string) {
  // just replace dashes with underscores
  return contract.replace(/-/g, '_')
}

export function getContractDirectory (contract: string) {
  return `${getCWD()}/contracts/${contract}`
}
