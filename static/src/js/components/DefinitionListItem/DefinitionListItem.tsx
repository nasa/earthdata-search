import { kebabCase } from 'lodash-es'
import React from 'react'
import Col from 'react-bootstrap/Col'

/**
 * Props for a definition list item component
 */
export interface DefinitionListItemProps {
  /** The index of the item in the list */
  index: string
  /** The label for the definition list item */
  label: string
  /** The value for the definition list item */
  value: string | number | React.ReactNode
  /** The props to pass the React Bootstrap Col component */
  colProps?: React.ComponentProps<typeof Col>
}

/**
 * A definition list item to display definition list groups with a label and value
 */
const DefinitionListItem = ({
  index,
  label,
  value,
  colProps
}: DefinitionListItemProps) => {
  const id = `definition-list-item_${kebabCase(label)}-${index}`

  return (
    <Col {...colProps}>
      <dt id={id}>{label}</dt>
      <dd aria-labelledby={id}>{value}</dd>
    </Col>
  )
}

export default DefinitionListItem
