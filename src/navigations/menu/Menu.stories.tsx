import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Menu } from "./Menu";
import type { MenuItemDef } from "./Menu";
import { EditIcon, TrashIcon, ShareIcon, MoreVertIcon } from "../../data-display/icons";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

const actionItems: MenuItemDef[] = [
  { value: "edit", label: "Edit", icon: <EditIcon /> },
  { value: "share", label: "Share", icon: <ShareIcon /> },
  { value: "delete", label: "Delete", icon: <TrashIcon /> },
];

const withDisabledItems: MenuItemDef[] = [
  { value: "edit", label: "Edit" },
  { value: "share", label: "Share (unavailable)", disabled: true },
  { value: "delete", label: "Delete" },
];

function ControlledDemo() {
  const [lastSelected, setLastSelected] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <Menu trigger="Actions" items={actionItems} onSelect={setLastSelected} />
      <span style={{ color: "#9aa0a6", fontSize: "0.85rem" }}>
        {lastSelected ? `Selected: ${lastSelected}` : "Nothing selected yet"}
      </span>
    </div>
  );
}

function MenuShowcase() {
  return (
    <ShowcasePage title="Menu" description="A trigger button that opens a role=menu popup of actions.">
      <ShowcaseCard
        label="basic"
        code={`<Menu
  trigger="Actions"
  items={[
    { value: "edit", label: "Edit", icon: <EditIcon /> },
    { value: "share", label: "Share", icon: <ShareIcon /> },
    { value: "delete", label: "Delete", icon: <TrashIcon /> },
  ]}
  onSelect={(value) => {}}
/>`}
      >
        <ControlledDemo />
      </ShowcaseCard>

      <ShowcaseCard
        label="disabled item"
        code={`<Menu trigger="More" items={[{ value: "share", label: "Share (unavailable)", disabled: true }, ...]} />`}
      >
        <Menu trigger="More" items={withDisabledItems} />
      </ShowcaseCard>

      <ShowcaseCard
        label="icon-only trigger"
        code={`<Menu trigger={<MoreVertIcon />} triggerLabel="More actions" items={actionItems} />`}
      >
        <Menu
          trigger={
            <span style={{ display: "block", width: "1.1rem", height: "1.1rem" }}>
              <MoreVertIcon />
            </span>
          }
          triggerLabel="More actions"
          items={actionItems}
        />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof MenuShowcase> = {
  title: "Navigations/Menu",
  component: MenuShowcase,
};

export default meta;
type Story = StoryObj<typeof MenuShowcase>;

export const Showcase: Story = {
  render: () => <MenuShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Menu")).toBeInTheDocument();
    await expect(canvas.getByText("Nothing selected yet")).toBeInTheDocument();

    const trigger = canvas.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);

    const menu = canvas.getByRole("menu");
    await expect(within(menu).getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();

    await userEvent.click(within(menu).getByRole("menuitem", { name: "Share" }));
    await expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
    await expect(canvas.getByText("Selected: share")).toBeInTheDocument();

    // Escape closes without a selection, and returns focus to the trigger.
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();

    const disabledTrigger = canvas.getByRole("button", { name: "More" });
    await userEvent.click(disabledTrigger);
    await expect(canvas.getByRole("menuitem", { name: "Share (unavailable)" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await userEvent.keyboard("{Escape}");

    const iconTrigger = canvas.getByRole("button", { name: "More actions" });
    await expect(iconTrigger).toBeInTheDocument();
  },
};
