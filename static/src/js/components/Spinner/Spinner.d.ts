import React from 'react'

import type { DotsProps } from './Dots'

/** An interface for the Spinner component */
export interface SpinnerProps extends DotsProps {
  type: string
}

export const Spinner: React.FC<SpinnerProps>

export default Spinner
