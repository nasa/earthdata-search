import React from 'react'
import Row from 'react-bootstrap/Row'

import DefinitionListItem, {
  DefinitionListItemProps
} from '../DefinitionListItem/DefinitionListItem'

/**
 * Props for a definition list component
 */
export interface DefinitionListProps {
  /** The items to display in the definition list. Nested arrays of items will be displayed in separate rows. */
  items: (Omit<DefinitionListItemProps, 'index'>)[] | (Omit<DefinitionListItemProps, 'index'>)[][]
}

/**
 * A definition list component to display a list of definitions as a groups with a label and value in a grid
 */
const DefinitionList = ({ items }: DefinitionListProps) => (
  <dl>
    {
      items.map((item, itemIndex) => {
        if (Array.isArray(item)) {
          return (
            <Row key={item.map((subItem) => subItem.label).join('-')} className="mb-4">
              {
                item.map((subItem, subItemIndex) => (
                  <DefinitionListItem
                    {...subItem}
                    key={subItem.label}
                    index={`${itemIndex}-${subItemIndex}`}
                  />
                ))
              }
            </Row>
          )
        }

        return (
          <Row key={item.label} className="mb-4">
            <DefinitionListItem
              {...item}
              index={`${itemIndex}`}
            />
          </Row>
        )
      })
    }
  </dl>
)

export default DefinitionList
