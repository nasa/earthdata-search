import { upperFirst } from 'lodash'

export const orderStates = {
  success: [
    'complete'
  ],
  errored: [
    'failed',
    'canceled',
    'cancelling',
    'submit_rejected',
    'submit_failed',
    'quote_rejected',
    'quote_failed',
    'not_validated'
  ],
  in_progress: [
    'in progress'
  ]
}

/**
 * Remove underscores, uppercase first letter, then add spaces back. This relies on multi worder statuses to look
 * like 'not_validated' which would output 'Not Validated'.
 * @param {String} status - The current order status
 * @returns {String} - The formatted order status.
 */
export const formatOrderStatus = status => status.split('_').map(word => upperFirst(word)).join(' ')


/**
 * Returns whether or not the order state state is 'errored', 'success', or 'in progress' based on its order status.
 * @param {String} status - The current order status
 * @returns {String|False} - A string representing the current state, or false if the state does not match a status.
 */
export const getStateFromOrderStatus = (status) => {
  if (orderStates.errored.indexOf(status) > -1) return 'errored'
  if (orderStates.success.indexOf(status) > -1) return 'success'
  if (orderStates.in_progress.indexOf(status) > -1) return 'in progress'
  return false
}
