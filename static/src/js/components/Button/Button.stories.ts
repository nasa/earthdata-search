import { fn } from '@storybook/test'

import { FaRocket } from 'react-icons/fa'
import Button from './Button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    children: { control: 'text' },
    tooltip: { control: 'text' }
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() }
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    children: 'Download All',
    bootstrapVariant: 'primary'
  }
}

export const Light = {
  args: {
    children: 'Download',
    bootstrapVariant: 'light'
  }
}

export const Tooltip = {
  args: {
    children: 'Hover Me',
    bootstrapVariant: 'primary',
    tooltip: 'This is some really helpful context',
    tooltipId: 'tooltip-id'
  }
}

export const Icon = {
  args: {
    label: 'Button',
    children: 'Download All',
    bootstrapVariant: 'primary',
    icon: FaRocket
  }
}

export const IconOnly = {
  args: {
    label: 'Button',
    icon: FaRocket
  }
}

export const Badge = {
  args: {
    label: 'Button',
    children: 'Download All',
    bootstrapVariant: 'primary',
    badge: '1000'
  }
}

export const HDSPrimary = {
  args: {
    label: 'Button',
    children: 'Explore',
    variant: 'hds-primary',
    bootstrapVariant: 'naked',
    bootstrapSize: 'lg'
  }
}
