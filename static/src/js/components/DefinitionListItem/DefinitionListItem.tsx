import React from 'react'
import { Col } from 'react-bootstrap'

/**
 * Props for a definition list item component
 */
export interface DefinitionListItemProps {
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
const DefinitionListItem = ({ label, value, colProps }: DefinitionListItemProps) => (
  <Col {...colProps}>
    <dt>{label}</dt>
    <dd>{value}</dd>
  </Col>
)

export default DefinitionListItem
