import '../static/src/css/main.scss'

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light", // Choose a default background
      values: [
        { name: "light", value: "#ffffff" }
      ],
    },
  },
  tags: ['autodocs']
};

export default preview;