import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Switch } from "./Switch";
import { FormControlLabel } from "../form-control-label";
import { palette } from "../../foundations/colors";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function ControlledDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={setChecked} />}
      label={checked ? "On" : "Off"}
    />
  );
}

function SwitchShowcase() {
  return (
    <ShowcasePage title="Switch" description="An immediate on/off toggle, for settings that take effect right away.">
      <ShowcaseCard label="off / on" code={`<Switch />\n<Switch defaultChecked />`}>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Switch aria-label="Off example" />
          <Switch defaultChecked aria-label="On example" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        label="with label (FormControlLabel)"
        code={`<FormControlLabel control={<Switch defaultChecked />} label="Notifications" />`}
      >
        <FormControlLabel control={<Switch defaultChecked />} label="Notifications" />
      </ShowcaseCard>

      <ShowcaseCard label="controlled" code={`<Switch checked={checked} onChange={setChecked} />`}>
        <ControlledDemo />
      </ShowcaseCard>

      <ShowcaseCard label="size" code={`<Switch size="small" defaultChecked />\n<Switch size="medium" defaultChecked />`}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Switch size="small" defaultChecked aria-label="Small" />
          <Switch size="medium" defaultChecked aria-label="Medium" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="color" code={`<Switch color={palette.red.A700} defaultChecked />`}>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Switch color={palette.red.A700} defaultChecked aria-label="Danger" />
          <Switch color={palette.green[800]} defaultChecked aria-label="Success" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="disabled" code={`<Switch disabled />\n<Switch disabled defaultChecked />`}>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Switch disabled aria-label="Disabled off" />
          <Switch disabled defaultChecked aria-label="Disabled on" />
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof SwitchShowcase> = {
  title: "Components/Switch",
  component: SwitchShowcase,
};

export default meta;
type Story = StoryObj<typeof SwitchShowcase>;

export const Showcase: Story = {
  render: () => <SwitchShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Switch")).toBeInTheDocument();

    const off = canvas.getByRole("switch", { name: "Off example" });
    await expect(off).not.toBeChecked();
    await userEvent.click(off);
    await expect(off).toBeChecked();

    const on = canvas.getByRole("switch", { name: "On example" });
    await expect(on).toBeChecked();

    // Controlled demo's label toggles between "Off"/"On" on change.
    await userEvent.click(canvas.getByText("Off", { selector: ".form-control-label-text" }));
    await expect(canvas.getByText("On", { selector: ".form-control-label-text" })).toBeInTheDocument();

    const disabledOn = canvas.getByRole("switch", { name: "Disabled on" });
    await expect(disabledOn).toBeDisabled();
  },
};
