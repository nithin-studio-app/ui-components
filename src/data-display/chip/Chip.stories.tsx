import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Chip } from "./Chip";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function DotIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" fill="currentColor" />
    </svg>
  );
}

function ChipShowcase() {
  return (
    <ShowcasePage title="Chip" description="A compact label, optionally clickable and/or deletable.">
      <ShowcaseCard label="filled / outlined">
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Chip label="Filled" />
          <Chip label="Outlined" variant="outlined" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="with icon">
        <Chip label="Active" icon={<DotIcon />} />
      </ShowcaseCard>

      <ShowcaseCard label="clickable">
        <Chip label="Click me" onClick={fn()} />
      </ShowcaseCard>

      <ShowcaseCard label="deletable">
        <Chip label="Removable" onDelete={fn()} />
      </ShowcaseCard>

      <ShowcaseCard label="clickable + deletable">
        <Chip label="Both" onClick={fn()} onDelete={fn()} />
      </ShowcaseCard>

      <ShowcaseCard label="disabled">
        <Chip label="Disabled" onClick={fn()} onDelete={fn()} disabled />
      </ShowcaseCard>

      <ShowcaseCard label="color">
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Chip label="Danger" color="#d50000" />
          <Chip label="Success" color="#64dd17" variant="outlined" />
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof ChipShowcase> = {
  title: "DataDisplay/Chip",
  component: ChipShowcase,
};

export default meta;
type Story = StoryObj<typeof ChipShowcase>;

export const Showcase: Story = {
  render: () => <ChipShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Chip")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Click me" }));

    const removableButtons = canvas.getAllByRole("button", { name: "Remove" });
    await expect(removableButtons.length).toBeGreaterThan(0);
    await userEvent.click(removableButtons[0]);

    // clickable + deletable: the two buttons are independent, clicking
    // one shouldn't be blocked by (or trigger) the other.
    const bothChip = canvas.getByText("Both").closest(".chip");
    await expect(bothChip).not.toBeNull();

    // disabled=true drops button semantics from the (non-activatable)
    // main area entirely, and disables the delete button.
    await expect(canvas.queryByRole("button", { name: "Disabled" })).not.toBeInTheDocument();
    const disabledDelete = removableButtons[removableButtons.length - 1];
    await expect(disabledDelete).toBeDisabled();
  },
};
