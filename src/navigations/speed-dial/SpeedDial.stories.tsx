import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SpeedDial } from "./SpeedDial";
import type { SpeedDialAction } from "./SpeedDial";
import { AddIcon, EditIcon, ShareIcon, TrashIcon } from "../../data-display/icons";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

const fileActions: SpeedDialAction[] = [
  { value: "edit", icon: <EditIcon />, label: "Edit" },
  { value: "share", icon: <ShareIcon />, label: "Share" },
  { value: "delete", icon: <TrashIcon />, label: "Delete" },
];

function ControlledDemo() {
  const [lastAction, setLastAction] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem", height: "12rem", justifyContent: "flex-end" }}>
      <span style={{ color: "#9aa0a6", fontSize: "0.85rem" }}>
        {lastAction ? `Last action: ${lastAction}` : "No action chosen yet"}
      </span>
      <SpeedDial icon={<AddIcon />} actions={fileActions} onAction={setLastAction} aria-label="File actions" />
    </div>
  );
}

function SpeedDialShowcase() {
  return (
    <ShowcasePage title="SpeedDial" description="A Fab that expands into a stack of related actions.">
      <ShowcaseCard
        label="basic (direction=up, default)"
        code={`<SpeedDial
  icon={<AddIcon />}
  aria-label="File actions"
  actions={[
    { value: "edit", icon: <EditIcon />, label: "Edit" },
    { value: "share", icon: <ShareIcon />, label: "Share" },
    { value: "delete", icon: <TrashIcon />, label: "Delete" },
  ]}
  onAction={(value) => {}}
/>`}
      >
        <ControlledDemo />
      </ShowcaseCard>

      <ShowcaseCard label="direction=right" code={`<SpeedDial direction="right" icon={<AddIcon />} actions={actions} aria-label="Actions" />`}>
        <div style={{ height: "4rem" }}>
          <SpeedDial direction="right" icon={<AddIcon />} actions={fileActions} aria-label="Right-opening actions" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="direction=down" code={`<SpeedDial direction="down" icon={<AddIcon />} actions={actions} aria-label="Actions" />`}>
        <SpeedDial direction="down" icon={<AddIcon />} actions={fileActions} aria-label="Down-opening actions" />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof SpeedDialShowcase> = {
  title: "Navigations/SpeedDial",
  component: SpeedDialShowcase,
};

export default meta;
type Story = StoryObj<typeof SpeedDialShowcase>;

export const Showcase: Story = {
  render: () => <SpeedDialShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("SpeedDial")).toBeInTheDocument();
    await expect(canvas.getByText("No action chosen yet")).toBeInTheDocument();

    const main = canvas.getByRole("button", { name: "File actions" });
    await expect(main).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(main);
    await expect(main).toHaveAttribute("aria-expanded", "true");

    const deleteAction = canvas.getByRole("button", { name: "Delete" });
    await userEvent.click(deleteAction);

    await expect(main).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.getByText("Last action: delete")).toBeInTheDocument();
    await expect(main).toHaveFocus();

    // Escape also closes it and returns focus to the main button.
    await userEvent.click(main);
    await userEvent.keyboard("{Escape}");
    await expect(main).toHaveAttribute("aria-expanded", "false");
    await expect(main).toHaveFocus();
  },
};
