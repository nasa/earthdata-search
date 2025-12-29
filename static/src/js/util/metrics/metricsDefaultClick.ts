const { dataLayer = [] } = window

/**
* Pushes a defaultClick event on the dataLayer.
* @param {string} elementLabel The label of the clicked element
*/
export const metricsDefaultClick = (elementLabel: string) => {
  dataLayer.push({
    event: 'defaultClick',
    defaultClickCategory: 'button',
    defaultClickAction: 'click',
    defaultClickLabel: elementLabel
  })
}
