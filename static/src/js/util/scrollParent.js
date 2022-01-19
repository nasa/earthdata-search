// more minimal version of https://github.com/olahol/scrollParent.js/blob/master/scrollParent.js
const regex = /(auto|scroll)/

const style = (node, prop) => getComputedStyle(node, null).getPropertyValue(prop)

const scroll = (node) => regex.test(
  style(node, 'overflow')
  + style(node, 'overflow-y')
  + style(node, 'overflow-x')
)

const scrollParent = (node) => {
  if (!node || node === document.body) {
    return document.body
  }
  return scroll(node) ? node : scrollParent(node.parentNode)
}

export default scrollParent
