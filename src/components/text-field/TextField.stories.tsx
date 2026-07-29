import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { TextField } from "./TextField";
import { SearchIcon, PersonIcon } from "../../data-display/icons";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function ControlledDemo() {
  const [value, setValue] = useState("");
  return <TextField label="Username" value={value} onChange={setValue} helperText={`${value.length}/20`} />;
}

function TextFieldShowcase() {
  return (
    <ShowcasePage title="TextField" description="A labeled text input, in outlined/filled/standard variants.">
      <ShowcaseCard
        label="variant"
        code={`<TextField variant="outlined" label="Outlined" />
<TextField variant="filled" label="Filled" />
<TextField variant="standard" label="Standard" />`}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <TextField variant="outlined" label="Outlined" />
          <TextField variant="filled" label="Filled" />
          <TextField variant="standard" label="Standard" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="with value" code={`<TextField label="Name" defaultValue="Jane Doe" />`}>
        <TextField label="Name" defaultValue="Jane Doe" />
      </ShowcaseCard>

      <ShowcaseCard
        label="placeholder"
        code={`<TextField label="Email" placeholder="jane@example.com" />`}
      >
        <TextField label="Email" placeholder="jane@example.com" />
      </ShowcaseCard>

      <ShowcaseCard label="helperText" code={`<TextField label="Password" helperText="At least 8 characters" />`}>
        <TextField label="Password" type="password" helperText="At least 8 characters" />
      </ShowcaseCard>

      <ShowcaseCard label="error" code={`<TextField label="Email address" error helperText="Enter a valid email" />`}>
        <TextField label="Email address" error defaultValue="not-an-email" helperText="Enter a valid email" />
      </ShowcaseCard>

      <ShowcaseCard label="required" code={`<TextField label="Full name" required />`}>
        <TextField label="Full name" required />
      </ShowcaseCard>

      <ShowcaseCard label="size" code={`<TextField size="small" label="Small" />\n<TextField size="medium" label="Medium" />`}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <TextField size="small" label="Small" />
          <TextField size="medium" label="Medium" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="disabled" code={`<TextField label="Disabled" disabled defaultValue="Can't edit" />`}>
        <TextField label="Disabled" disabled defaultValue="Can't edit" />
      </ShowcaseCard>

      <ShowcaseCard
        label="adornments"
        code={`<TextField label="Search" startAdornment={<SearchIcon />} />
<TextField label="Username" endAdornment={<PersonIcon />} />`}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <TextField label="Search" startAdornment={<SearchIcon />} />
          <TextField label="Account" endAdornment={<PersonIcon />} />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="multiline" code={`<TextField label="Bio" multiline rows={3} />`}>
        <TextField label="Bio" multiline rows={3} />
      </ShowcaseCard>

      <ShowcaseCard label="fullWidth" code={`<TextField label="Full width" fullWidth />`}>
        <div style={{ width: "24rem" }}>
          <TextField label="Full width" fullWidth />
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="controlled" code={`<TextField value={value} onChange={setValue} helperText={\`\${value.length}/20\`} />`}>
        <ControlledDemo />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof TextFieldShowcase> = {
  title: "Components/TextField",
  component: TextFieldShowcase,
};

export default meta;
type Story = StoryObj<typeof TextFieldShowcase>;

export const Showcase: Story = {
  render: () => <TextFieldShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("TextField")).toBeInTheDocument();

    // Real label association via <label for>.
    const outlined = canvas.getByLabelText("Outlined");
    await expect(outlined).toBeInTheDocument();

    const name = canvas.getByLabelText("Name");
    await expect(name).toHaveValue("Jane Doe");

    const emailError = canvas.getByLabelText("Email address");
    await expect(emailError).toHaveAttribute("aria-invalid", "true");
    await expect(canvas.getByText("Enter a valid email")).toBeInTheDocument();

    const disabled = canvas.getByLabelText("Disabled");
    await expect(disabled).toBeDisabled();

    const required = canvas.getByLabelText("Full name", { exact: false });
    await expect(required).toBeRequired();

    // Typing updates the controlled demo's helper text live.
    const controlled = canvas.getByLabelText("Username");
    await userEvent.type(controlled, "abc");
    await expect(canvas.getByText("3/20")).toBeInTheDocument();
  },
};
