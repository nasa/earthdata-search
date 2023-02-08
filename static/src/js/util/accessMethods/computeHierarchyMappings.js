import { isArray, isEmpty } from 'lodash'

/**
 * Returns variable ids grouped by their hierarchical names
 * @param {Array} variables Array of UMM V Objects
 */
export const computeHierarchyMappings = (variables) => {
  const calculatedMappings = []

  // Loop through each variable
  variables.forEach((variable) => {
    const { conceptId: variableId, name } = variable

    // If the name isn't hierarchical, push the variableId onto calculatedMappings
    if (!name.includes('/')) {
      calculatedMappings.push({ id: variableId })
      return
    }

    const nameParts = name.split('/').filter(Boolean)

    // newObject is the source of all the data in the new variable object
    const newObject = {}

    // workingObject holds onto the part of the full object that is currently being processed
    let workingObject = newObject

    // Loop through each part of the hierarchical name
    // Find a matching object in calculatedMappings, or create a new one
    nameParts.forEach((name, nameIndex) => {
      // If we are at the very end of nameParts, don't process it (that info is returned from the variable on the client-side)
      if (nameIndex === nameParts.length - 1) return

      let objectToSearch = [workingObject]
      // If we are at the beginning of nameParts, search through calculatedMappings
      if (nameIndex === 0) objectToSearch = calculatedMappings

      // Search for a object with a label matching the current name
      const foundIndex = objectToSearch.findIndex((mapping) => (
        mapping.label === name
      ))

      // If a name was not found
      if (foundIndex === -1) {
        workingObject.label = name

        // If at the end - 1 of the name parts loop, the children needs to be the variableId.
        // end - 1 because the last name isn't important, the client-side gets that info from the variable
        if (nameIndex === nameParts.length - 2) {
          if (workingObject.children) {
            workingObject.children = workingObject.children.concat({ id: variableId })
          } else {
            workingObject.children = [{ id: variableId }]
          }
        } else {
          // Push an empty object to the workingObject children array, and set the new workingObject to that new object
          if (!isArray(workingObject.children)) workingObject.children = []

          workingObject.children.push({})
          workingObject = workingObject.children[workingObject.children.length - 1]
        }
      } else {
        // If a matching name was found

        // If at the beginning of the nameParts loop, set workingObject to the found calculatedMappings
        if (nameIndex === 0) workingObject = calculatedMappings[foundIndex]

        // If at the end - 1 of the name parts loop, the children needs to be the variableId.
        // end - 1 because the last name isn't important, the client-side gets that info from the variable
        if (nameIndex === nameParts.length - 2) {
          // concat the variableId with any existing children
          workingObject.children = workingObject.children.concat({ id: variableId })
        } else {
          // Check to see if the next name is found in the current workingObject.children
          const nextFound = workingObject.children.findIndex((mapping) => (
            mapping.label === nameParts[nameIndex + 1]
          ))

          if (nextFound === -1) {
            // If the next name isn't found, add a new empty object to the current workingObject.children
            // and set that new object to the workingObject
            workingObject.children.push({})
            workingObject = workingObject.children[workingObject.children.length - 1]
          } else {
            // If the next name is found, set the working object to the nextFound of the current workingObject.children
            workingObject = workingObject.children[nextFound]
          }
        }
      }
    })

    // If new object ended up with any values, add it to calculatedMappings
    if (!isEmpty(newObject)) calculatedMappings.push(newObject)
  })

  return calculatedMappings
}
