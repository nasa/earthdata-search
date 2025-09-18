import * as React from 'react'

/** An interface for the Dots component */
export interface DotsProps {
  className?: string | null
  color?: string
  dataTestId?: string | null
  inline?: boolean
  size?: string
  label?: string
}

export const Dots: React.FC<DotsProps>

/** An interface for the Spinner component */
export interface SpinnerProps extends DotsProps {
  type: string
}

export const Spinner: React.FC<SpinnerProps>

export default Spinner
