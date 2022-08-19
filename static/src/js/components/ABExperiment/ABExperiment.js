import { isEmptyObject } from 'jquery'
import PropTypes from 'prop-types'

import useExperiment from '../../hooks/useExperiment'

/**
 * Renders an ABExperiment component. This component takes a Google Optimize
 * experiment id, and provides a variant id to be used to trigger UI changes in
 * it's children. If no variants mapping is present, the component will return
 * the variant id directly from Google Optimize. The variants mapping can be
 * used to return human-readable names for the variants. If an error occurs, the
 * `variant` prop will be `undefined`.
 * @param {Object} props - The props passed into the component.
 * @param {Function} props.children - A function returning React elements.
 * @param {String} props.experimentId - The unique experiment id provided by Google Optimize.
 * @param {Object} props.variants - A mapping of the variant ids provided from Google Optimize
 *  to human-readable names to be returned to the children function.
 */
export const ABExperiment = ({
  children,
  experimentId,
  variants
}) => {
  // If there is no experiment id, return the children without a variant, which will
  // render the default variant
  if (!experimentId || !variants || isEmptyObject(variants)) return children({ variant: undefined })

  // Variant hook returns the variant id for a given matching
  // Google Optimize experiment
  const variantId = useExperiment(experimentId)

  let parsedVariants

  // Catch any potential errors parsing the variants JSON string. If any errors occur,
  // render with no variant, which will render the default experiment.
  try {
    parsedVariants = JSON.parse(variants)
  } catch {
    return children({ variant: undefined })
  }

  // If a variant is defined in the variants mapping, return the value
  // for the given key, otherwise return the variant id set by Google Optimize.
  const variant = parsedVariants[variantId] || variantId

  // Call the children function and provide the variant
  return children({ variant })
}

ABExperiment.defaultProps = {
  experimentId: '',
  children: null,
  variants: ''
}

ABExperiment.propTypes = {
  children: PropTypes.func.isRequired,
  experimentId: PropTypes.string,
  variants: PropTypes.string
}

export default ABExperiment
