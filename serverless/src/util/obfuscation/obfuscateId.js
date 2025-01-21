import ScatterSwap from 'scatter-swap'

/**
 * Obfuscate a database ID to hide its identity
 * @param {Integer} value The value to be obfuscated
 */
export const obfuscateId = (value, spin = process.env.OBFUSCATION_SPIN) => (
  new ScatterSwap(value, spin).hash()
)
