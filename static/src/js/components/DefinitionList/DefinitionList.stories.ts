import DefinitionList from './DefinitionList'

export default {
  title: 'Components/DefinitionList',
  component: DefinitionList,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
}

export const Basic = {
  args: {
    items: [
      [
        {
          label: 'Lorem ipsum',
          value: 'This item is auto width'
        },
        {
          label: 'Ad nec iuvaret',
          value: 'This column is auto width'
        }
      ],
      {
        label: 'Vix ut solum',
        value: 'This item is on a new row and auto width'
      }
    ]
  }
}

export const Complex = {
  args: {
    items: [
      [
        {
          label: 'Lorem ipsum',
          value: 'This column is 75% width',
          colProps: {
            xs: 8
          }
        },
        {
          label: 'Ad nec iuvaret',
          value: 'This column is auto width'
        }
      ],
      {
        label: 'Vix ut solum',
        value: 'This item is on a new row and auto width'
      },
      [
        {
          label: 'Populo temporibus pri',
          value: 'This column is auto width'
        },
        {
          label: 'Dicit accusamus similique',
          value: 'This column is auto width'
        }
      ]
    ]
  }
}
