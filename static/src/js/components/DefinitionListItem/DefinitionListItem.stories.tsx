import React from 'react'
import DefinitionListItem from './DefinitionListItem'

export default {
  title: 'Components/DefinitionListItem',
  component: DefinitionListItem,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
}

export const Basic = {
  args: {
    label: 'Term',
    value: 'Definition'
  }
}

export const WithColProps = {
  args: {
    label: 'Wide Term',
    value: 'This column is wider',
    colProps: {
      xs: 8
    }
  }
}

export const WithReactNodeValue = {
  args: {
    label: 'Custom Content',
    value: <span style={{ color: 'red' }}>This value is a ReactNode</span>
  }
}
