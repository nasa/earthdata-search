import PropTypes from 'prop-types'

import useExperiment from '../../hooks/useExperiment'

/**
 * Renders an ABExperiment component. This component takes a Google Optimize
 * experiment id, and provides a variant id to be used to trigger UI changes
 * in it's children. If no variants mapping is present, the component will return
 * the variant id directly from Google Optimize. The variants mapping can be used
 * to return human-readable names for the variants.
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
  // Variant hook returns the variant id for a given matching
  // Google Optimize experiment
  const variantId = useExperiment(experimentId)

  // If a variant is defined in the variants mapping, return the value
  // for the given key, otherwise return the variant id set by Google Optimize.
  const variant = variants[variantId] || variantId

  // Call the children function and provide the variant
  return children({ variant })
}

ABExperiment.defaultProps = {
  children: null,
  variants: {}
}

ABExperiment.propTypes = {
  children: PropTypes.func.isRequired,
  experimentId: PropTypes.string.isRequired,
  variants: PropTypes.shape({})
}

export default ABExperiment
