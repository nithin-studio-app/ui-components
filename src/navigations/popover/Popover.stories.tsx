import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Popover } from "./Popover";
import { Text } from "../../data-display/text";
import { TextField } from "../../components/text-field";
import { Button } from "../../components/button";
import { FilterIcon } from "../../data-display/icons";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function PopoverShowcase() {
  return (
    <ShowcasePage title="Popover" description="A trigger button that opens a floating panel of arbitrary content.">
      <ShowcaseCard
        label="basic"
        code={`<Popover trigger="More info" label="More info">
  <Text>Some extra detail, shown on demand.</Text>
</Popover>`}
      >
        <Popover trigger="More info" label="More info">
          <Text>Some extra detail, shown on demand.</Text>
        </Popover>
      </ShowcaseCard>

      <ShowcaseCard
        label="with a form"
        code={`<Popover trigger="Rename" label="Rename">
  <TextField label="Name" defaultValue="Untitled" />
  <Button variant="contained">Save</Button>
</Popover>`}
      >
        <Popover trigger="Rename" label="Rename">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <TextField label="Name" defaultValue="Untitled" />
            <Button variant="contained">Save</Button>
          </div>
        </Popover>
      </ShowcaseCard>

      <ShowcaseCard
        label="icon-only trigger"
        code={`<Popover trigger={<FilterIcon />} triggerLabel="Filters" label="Filters">…</Popover>`}
      >
        <Popover
          trigger={
            <span style={{ display: "block", width: "1.1rem", height: "1.1rem" }}>
              <FilterIcon />
            </span>
          }
          triggerLabel="Filters"
          label="Filters"
        >
          <Text>Filter options would go here.</Text>
        </Popover>
      </ShowcaseCard>

      <ShowcaseCard label="placement: bottom-end" code={`<Popover placement="bottom-end" trigger="Aligned right" label="Aligned right">…</Popover>`}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Popover placement="bottom-end" trigger="Aligned right" label="Aligned right">
            <Text>This panel's right edge aligns with the trigger's.</Text>
          </Popover>
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof PopoverShowcase> = {
  title: "Navigations/Popover",
  component: PopoverShowcase,
};

export default meta;
type Story = StoryObj<typeof PopoverShowcase>;

export const Showcase: Story = {
  render: () => <PopoverShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Popover")).toBeInTheDocument();

    const trigger = canvas.getByRole("button", { name: "More info" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = canvas.getByRole("dialog", { name: "More info" });
    await expect(within(panel).getByText("Some extra detail, shown on demand.")).toBeInTheDocument();
    await expect(panel).toHaveFocus();

    // Escape closes it and returns focus to the trigger.
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("dialog", { name: "More info" })).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();

    // A form popover focuses its first field, and clicking outside closes it.
    const renameTrigger = canvas.getByRole("button", { name: "Rename" });
    await userEvent.click(renameTrigger);
    await expect(canvas.getByLabelText("Name")).toHaveFocus();
    await userEvent.click(canvas.getByText("Popover"));
    await expect(canvas.queryByRole("dialog", { name: "Rename" })).not.toBeInTheDocument();

    const iconTrigger = canvas.getByRole("button", { name: "Filters" });
    await expect(iconTrigger).toBeInTheDocument();
  },
};
