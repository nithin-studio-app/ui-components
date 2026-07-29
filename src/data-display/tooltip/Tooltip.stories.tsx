import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Tooltip } from "./Tooltip";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

const buttonStyle: CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  border: "1px solid #4a4d52",
  background: "#3a3d42",
  color: "#f0f0f0",
  cursor: "pointer",
};

function TooltipShowcase() {
  return (
    <ShowcasePage title="Tooltip" description="A short label on hover or focus, dismissible with Escape.">
      <ShowcaseCard
        label="placement"
        code={`<Tooltip title="Top tooltip" placement="top"><button>Top</button></Tooltip>
<Tooltip title="Bottom tooltip" placement="bottom"><button>Bottom</button></Tooltip>
<Tooltip title="Left tooltip" placement="left"><button>Left</button></Tooltip>
<Tooltip title="Right tooltip" placement="right"><button>Right</button></Tooltip>`}
      >
        <div style={{ display: "flex", gap: "3rem", padding: "2rem" }}>
          <Tooltip title="Top tooltip" placement="top">
            <button type="button" style={buttonStyle}>
              Top
            </button>
          </Tooltip>
          <Tooltip title="Bottom tooltip" placement="bottom">
            <button type="button" style={buttonStyle}>
              Bottom
            </button>
          </Tooltip>
          <Tooltip title="Left tooltip" placement="left">
            <button type="button" style={buttonStyle}>
              Left
            </button>
          </Tooltip>
          <Tooltip title="Right tooltip" placement="right">
            <button type="button" style={buttonStyle}>
              Right
            </button>
          </Tooltip>
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        label="keyboard: focus shows it, Escape dismisses it"
        code={`<Tooltip title="Keyboard-accessible tooltip">
  <button>Focus me</button>
</Tooltip>`}
      >
        <Tooltip title="Keyboard-accessible tooltip">
          <button type="button" style={buttonStyle}>
            Focus me
          </button>
        </Tooltip>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof TooltipShowcase> = {
  title: "DataDisplay/Tooltip",
  component: TooltipShowcase,
};

export default meta;
type Story = StoryObj<typeof TooltipShowcase>;

export const Showcase: Story = {
  render: () => <TooltipShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Tooltip")).toBeInTheDocument();
    await expect(canvas.queryByRole("tooltip")).not.toBeInTheDocument();

    const topButton = canvas.getByRole("button", { name: "Top" });
    await userEvent.hover(topButton);
    await expect(canvas.getByRole("tooltip")).toHaveTextContent("Top tooltip");
    await expect(topButton).toHaveAttribute("aria-describedby", canvas.getByRole("tooltip").id);

    await userEvent.unhover(topButton);
    await expect(canvas.queryByRole("tooltip")).not.toBeInTheDocument();

    // Keyboard: focusing the trigger shows the tooltip too, not just hover.
    // (userEvent.click focuses the button as a real browser click would,
    // going through React's event system properly, unlike calling the DOM
    // .focus() method directly.)
    const focusButton = canvas.getByRole("button", { name: "Focus me" });
    await userEvent.click(focusButton);
    await expect(canvas.getByRole("tooltip")).toHaveTextContent("Keyboard-accessible tooltip");

    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("tooltip")).not.toBeInTheDocument();
  },
};
