import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Backdrop } from "./Backdrop";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function ToggleDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", height: "10rem", border: "1px dashed #2a2c30", borderRadius: "8px" }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ margin: "1rem", padding: "0.4rem 0.9rem", borderRadius: "6px", border: "1px solid #2a2c30", background: "#232529", color: "#f0f0f0", cursor: "pointer" }}
      >
        Show backdrop
      </button>
      <Backdrop open={open} fixed={false} onClick={() => setOpen(false)}>
        <span style={{ color: "#fff" }}>Click anywhere to dismiss</span>
      </Backdrop>
    </div>
  );
}

function BackdropShowcase() {
  return (
    <ShowcasePage title="Backdrop" description="A dimming overlay, typically behind a Dialog or a loading indicator.">
      <ShowcaseCard
        label="scoped to a container (fixed=false)"
        code={`<div style={{ position: "relative" }}>
  <Backdrop open={open} fixed={false} onClick={() => setOpen(false)}>
    Click anywhere to dismiss
  </Backdrop>
</div>`}
      >
        <ToggleDemo />
      </ShowcaseCard>

      <ShowcaseCard
        label="static preview (open, scoped)"
        code={`<Backdrop open fixed={false}>
  <span>Loading…</span>
</Backdrop>`}
      >
        <div style={{ position: "relative", height: "8rem", border: "1px dashed #2a2c30", borderRadius: "8px" }}>
          <Backdrop open fixed={false}>
            <span style={{ color: "#fff" }}>Loading…</span>
          </Backdrop>
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof BackdropShowcase> = {
  title: "Feedbacks/Backdrop",
  component: BackdropShowcase,
};

export default meta;
type Story = StoryObj<typeof BackdropShowcase>;

export const Showcase: Story = {
  render: () => <BackdropShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Backdrop")).toBeInTheDocument();

    // The static preview card's backdrop is always open.
    await expect(canvas.getByText("Loading…")).toBeInTheDocument();

    // The toggle demo starts closed, opens on click, and closes on its own click.
    await expect(canvas.queryByText("Click anywhere to dismiss")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Show backdrop" }));
    const dismissText = canvas.getByText("Click anywhere to dismiss");
    await expect(dismissText).toBeInTheDocument();
    await userEvent.click(dismissText);
    await expect(canvas.queryByText("Click anywhere to dismiss")).not.toBeInTheDocument();
  },
};
