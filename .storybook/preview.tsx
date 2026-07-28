import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },

    backgrounds: {
      default: "app",
      values: [{ name: "app", value: "#12141a" }],
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "error",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", padding: "1rem" }}>
        {Story()}
      </div>
    ),
  ],
};

export default preview;
