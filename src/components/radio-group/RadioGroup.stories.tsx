import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { RadioGroup } from "./RadioGroup";
import { Radio } from "./Radio";
import { FormControlLabel } from "../form-control-label";
import { palette } from "../../foundations/colors";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function ControlledDemo() {
  const [value, setValue] = useState("medium");
  return (
    <RadioGroup value={value} onChange={setValue} row aria-label="Size">
      <FormControlLabel control={<Radio value="small" />} label="Small" />
      <FormControlLabel control={<Radio value="medium" />} label={`Medium (selected: ${value})`} />
      <FormControlLabel control={<Radio value="large" />} label="Large" />
    </RadioGroup>
  );
}

function RadioGroupShowcase() {
  return (
    <ShowcasePage title="RadioGroup" description="A mutually-exclusive set of options, one always selected.">
      <ShowcaseCard
        label="basic"
        code={`<RadioGroup defaultValue="one" aria-label="Basic">
  <FormControlLabel value="one" control={<Radio value="one" />} label="One" />
  <FormControlLabel value="two" control={<Radio value="two" />} label="Two" />
</RadioGroup>`}
      >
        <RadioGroup value="one" aria-label="Basic">
          <FormControlLabel control={<Radio value="one" />} label="One" />
          <FormControlLabel control={<Radio value="two" />} label="Two" />
          <FormControlLabel control={<Radio value="three" />} label="Three" />
        </RadioGroup>
      </ShowcaseCard>

      <ShowcaseCard label="row" code={`<RadioGroup row aria-label="Row">…</RadioGroup>`}>
        <RadioGroup value="two" row aria-label="Row layout">
          <FormControlLabel control={<Radio value="one" />} label="One" />
          <FormControlLabel control={<Radio value="two" />} label="Two" />
        </RadioGroup>
      </ShowcaseCard>

      <ShowcaseCard label="controlled" code={`<RadioGroup value={value} onChange={setValue} row>…</RadioGroup>`}>
        <ControlledDemo />
      </ShowcaseCard>

      <ShowcaseCard label="color" code={`<Radio value="one" color={palette.red.A700} />`}>
        <RadioGroup value="one" row aria-label="Color">
          <FormControlLabel control={<Radio value="one" color={palette.red.A700} />} label="Danger" />
          <FormControlLabel control={<Radio value="two" color={palette.green[800]} />} label="Success" />
        </RadioGroup>
      </ShowcaseCard>

      <ShowcaseCard label="disabled" code={`<RadioGroup disabled>…</RadioGroup>`}>
        <RadioGroup value="one" disabled row aria-label="Disabled group">
          <FormControlLabel control={<Radio value="one" />} label="One" />
          <FormControlLabel control={<Radio value="two" />} label="Two" />
        </RadioGroup>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof RadioGroupShowcase> = {
  title: "Components/RadioGroup",
  component: RadioGroupShowcase,
};

export default meta;
type Story = StoryObj<typeof RadioGroupShowcase>;

export const Showcase: Story = {
  render: () => <RadioGroupShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("RadioGroup")).toBeInTheDocument();

    const basicGroup = canvas.getByRole("radiogroup", { name: "Basic" });
    await expect(within(basicGroup).getByRole("radio", { name: "One" })).toBeChecked();
    await expect(within(basicGroup).getByRole("radio", { name: "Two" })).not.toBeChecked();

    // Selecting within a group is mutually exclusive.
    const sizeGroup = canvas.getByRole("radiogroup", { name: "Size" });
    await userEvent.click(within(sizeGroup).getByRole("radio", { name: "Large" }));
    await expect(within(sizeGroup).getByRole("radio", { name: "Large" })).toBeChecked();
    await expect(within(sizeGroup).getByRole("radio", { name: "Small" })).not.toBeChecked();

    const disabledGroup = canvas.getByRole("radiogroup", { name: "Disabled group" });
    await expect(within(disabledGroup).getByRole("radio", { name: "One" })).toBeDisabled();
  },
};
