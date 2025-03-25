import ScatterSwap from 'scatter-swap'

/**
 * Deobfuscate a database ID determine it's original value
 * @param {Integer} value The value to deobfuscate
 */
export const deobfuscateId = (value, spin = process.env.OBFUSCATION_SPIN) => (
  parseInt(new ScatterSwap(value, spin).reverseHash(), 10)
)
