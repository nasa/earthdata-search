import '../static/src/css/main.scss'

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: { name: "light", value: "#ffffff" }
      }
    },
  },

  tags: ['autodocs'],

  initialGlobals: {
    backgrounds: {
      value: "light"
    }
  }
};

export default preview;