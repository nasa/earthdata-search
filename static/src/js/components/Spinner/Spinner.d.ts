import React from 'react'

/** An interface for the Dots component */
export interface DotsProps {
  /** A classname for the element */
  className?: string
  /** The color of the dots. Needs to match the one of the classes in Spinner.scss */
  color?: string
  /** A id for testing */
  dataTestId?: string
  /** Adds `inline-flex` so the Dots component can be displayed inline */
  inline?: boolean
  /** The size of the dots. Needs to match the one of the classes in Spinner.scss */
  size?: string
  /** An accessible label */
  label?: string
}

export const Dots: React.FC<DotsProps>

/** An interface for the Spinner component */
export interface SpinnerProps extends DotsProps {
  type: string
}

export const Spinner: React.FC<SpinnerProps>

export default Spinner
