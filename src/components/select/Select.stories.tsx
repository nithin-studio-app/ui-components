import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Select } from "./Select";
import type { SelectOption } from "./Select";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

const fruitOptions: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian (out of stock)", disabled: true },
];

function ControlledDemo() {
  const [value, setValue] = useState("banana");
  return <Select label="Fruit" options={fruitOptions} value={value} onChange={setValue} />;
}

function SelectShowcase() {
  return (
    <ShowcasePage title="Select" description="A menu-based dropdown for choosing one value from a list.">
      <ShowcaseCard
        label="basic"
        code={`<Select
  label="Fruit"
  placeholder="Select a fruit…"
  options={[{ value: "apple", label: "Apple" }, ...]}
  value={value}
  onChange={setValue}
/>`}
      >
        <Select placeholder="Select a fruit…" options={fruitOptions} aria-label="Fruit unselected" />
      </ShowcaseCard>

      <ShowcaseCard label="controlled, pre-selected" code={`<Select value={value} onChange={setValue} options={fruitOptions} />`}>
        <ControlledDemo />
      </ShowcaseCard>

      <ShowcaseCard label="size" code={`<Select size="small" options={fruitOptions} />\n<Select size="medium" options={fruitOptions} />`}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Select size="small" options={fruitOptions} placeholder="Small" aria-label="Small select" />
          <Select size="medium" options={fruitOptions} placeholder="Medium" aria-label="Medium select" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="disabled" code={`<Select disabled options={fruitOptions} />`}>
        <Select disabled options={fruitOptions} placeholder="Disabled" aria-label="Disabled select" />
      </ShowcaseCard>

      <ShowcaseCard label="fullWidth" code={`<Select fullWidth options={fruitOptions} />`}>
        <div style={{ width: "20rem" }}>
          <Select fullWidth options={fruitOptions} placeholder="Full width" aria-label="Full width select" />
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof SelectShowcase> = {
  title: "Components/Select",
  component: SelectShowcase,
};

export default meta;
type Story = StoryObj<typeof SelectShowcase>;

export const Showcase: Story = {
  render: () => <SelectShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Select")).toBeInTheDocument();

    // Controlled demo starts with a value selected and shows it as the trigger's text.
    const controlledTrigger = canvas.getByRole("button", { name: "Fruit Banana" });
    await expect(controlledTrigger).toBeInTheDocument();

    // Opening reveals the listbox with real option roles.
    await userEvent.click(controlledTrigger);
    const listbox = canvas.getByRole("listbox");
    await expect(within(listbox).getByRole("option", { name: "Cherry" })).toBeInTheDocument();
    await expect(within(listbox).getByRole("option", { name: "Banana" })).toHaveAttribute("aria-selected", "true");

    // Choosing an option closes the popup and updates the trigger's label.
    await userEvent.click(within(listbox).getByRole("option", { name: "Cherry" }));
    await expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Fruit Cherry" })).toBeInTheDocument();

    // Escape closes without changing the selection.
    const unselectedTrigger = canvas.getByRole("button", { name: "Fruit unselected" });
    await userEvent.click(unselectedTrigger);
    await expect(canvas.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();

    const disabledSelect = canvas.getByRole("button", { name: "Disabled select" });
    await expect(disabledSelect).toBeDisabled();
  },
};
