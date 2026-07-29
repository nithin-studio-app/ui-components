import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "./Checkbox";
import { FormControlLabel } from "../form-control-label";
import { palette } from "../../foundations/colors";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function ControlledDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={setChecked} />}
      label={checked ? "Checked" : "Unchecked"}
    />
  );
}

function CheckboxShowcase() {
  return (
    <ShowcasePage title="Checkbox" description="A binary (or indeterminate) toggle, with real native input semantics underneath.">
      <ShowcaseCard label="unchecked / checked" code={`<Checkbox />\n<Checkbox defaultChecked />`}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Checkbox aria-label="Unchecked example" />
          <Checkbox defaultChecked aria-label="Checked example" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="indeterminate" code={`<Checkbox indeterminate />`}>
        <Checkbox indeterminate aria-label="Indeterminate" />
      </ShowcaseCard>

      <ShowcaseCard
        label="with label (FormControlLabel)"
        code={`<FormControlLabel control={<Checkbox defaultChecked />} label="I agree to the terms" />`}
      >
        <FormControlLabel control={<Checkbox defaultChecked />} label="I agree to the terms" />
      </ShowcaseCard>

      <ShowcaseCard label="controlled" code={`<Checkbox checked={checked} onChange={setChecked} />`}>
        <ControlledDemo />
      </ShowcaseCard>

      <ShowcaseCard label="size" code={`<Checkbox size="small" defaultChecked />\n<Checkbox size="medium" defaultChecked />`}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Checkbox size="small" defaultChecked aria-label="Small" />
          <Checkbox size="medium" defaultChecked aria-label="Medium" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="color" code={`<Checkbox color={palette.red.A700} defaultChecked />`}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Checkbox color={palette.red.A700} defaultChecked aria-label="Danger" />
          <Checkbox color={palette.green[800]} defaultChecked aria-label="Success" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        label="disabled"
        code={`<Checkbox disabled />\n<Checkbox disabled defaultChecked />`}
      >
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Checkbox disabled aria-label="Disabled unchecked" />
          <Checkbox disabled defaultChecked aria-label="Disabled checked" />
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof CheckboxShowcase> = {
  title: "Components/Checkbox",
  component: CheckboxShowcase,
};

export default meta;
type Story = StoryObj<typeof CheckboxShowcase>;

export const Showcase: Story = {
  render: () => <CheckboxShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Checkbox")).toBeInTheDocument();

    const unchecked = canvas.getByRole("checkbox", { name: "Unchecked example" });
    await expect(unchecked).not.toBeChecked();
    await userEvent.click(unchecked);
    await expect(unchecked).toBeChecked();

    const checked = canvas.getByRole("checkbox", { name: "Checked" });
    await expect(checked).toBeChecked();

    // Label text toggles the underlying input via FormControlLabel's <label> wrapper.
    const controlledLabel = canvas.getByText("Checked", { selector: ".form-control-label-text" });
    await userEvent.click(controlledLabel);
    await expect(canvas.getByText("Unchecked", { selector: ".form-control-label-text" })).toBeInTheDocument();

    const disabledChecked = canvas.getByRole("checkbox", { name: "Disabled checked" });
    await expect(disabledChecked).toBeDisabled();
  },
};
