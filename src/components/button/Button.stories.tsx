import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";
import { DownloadIcon, ArrowForwardIcon } from "../../data-display/icons";
import { accent, palette } from "../../foundations/colors";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>{children}</div>;
}

function ButtonShowcase() {
  return (
    <ShowcasePage title="Button" description="A clickable action, in text/outlined/contained variants.">
      <ShowcaseCard
        label="variant"
        code={`<Button variant="text">Text</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="contained">Contained</Button>`}
      >
        <Row>
          <Button variant="text">Text</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="contained">Contained</Button>
        </Row>
      </ShowcaseCard>

      <ShowcaseCard
        label="color"
        code={`<Button variant="contained" color={palette.red.A700}>Danger</Button>
<Button variant="contained" color={palette.green[800]}>Success</Button>
<Button variant="outlined" color={palette.amber.A700}>Warning</Button>`}
      >
        <Row>
          <Button variant="contained" color={palette.red.A700}>
            Danger
          </Button>
          <Button variant="contained" color={palette.green[800]}>
            Success
          </Button>
          <Button variant="outlined" color={palette.amber.A700}>
            Warning
          </Button>
        </Row>
      </ShowcaseCard>

      <ShowcaseCard
        label="size"
        code={`<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>`}
      >
        <Row>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </Row>
      </ShowcaseCard>

      <ShowcaseCard
        label="startIcon / endIcon"
        code={`<Button variant="outlined" startIcon={<DownloadIcon />}>Download</Button>
<Button variant="contained" endIcon={<ArrowForwardIcon />}>Continue</Button>`}
      >
        <Row>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Download
          </Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />}>
            Continue
          </Button>
        </Row>
      </ShowcaseCard>

      <ShowcaseCard label="fullWidth" code={`<Button variant="contained" fullWidth>Full width</Button>`}>
        <div style={{ width: "20rem" }}>
          <Button variant="contained" fullWidth>
            Full width
          </Button>
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        label="disabled"
        code={`<Button variant="text" disabled>Text</Button>
<Button variant="outlined" disabled>Outlined</Button>
<Button variant="contained" disabled>Contained</Button>`}
      >
        <Row>
          <Button variant="text" disabled>
            Text
          </Button>
          <Button variant="outlined" disabled>
            Outlined
          </Button>
          <Button variant="contained" disabled>
            Contained
          </Button>
        </Row>
      </ShowcaseCard>

      <ShowcaseCard
        label="link (href)"
        code={`<Button href="https://example.com" variant="outlined">Link button</Button>`}
      >
        <Button href="https://example.com" variant="outlined">
          Link button
        </Button>
      </ShowcaseCard>

      <ShowcaseCard
        label="loading"
        code={`<Button variant="contained" loading>Center</Button>
<Button variant="outlined" loading loadingPosition="start" startIcon={<DownloadIcon />}>Start</Button>
<Button variant="outlined" loading loadingPosition="end" endIcon={<ArrowForwardIcon />}>End</Button>`}
      >
        <Row>
          <Button variant="contained" loading>
            Center
          </Button>
          <Button variant="outlined" loading loadingPosition="start" startIcon={<DownloadIcon />}>
            Start
          </Button>
          <Button variant="outlined" loading loadingPosition="end" endIcon={<ArrowForwardIcon />}>
            End
          </Button>
        </Row>
      </ShowcaseCard>

      <ShowcaseCard label="click handler" code={`<Button onClick={() => {}}>Click me</Button>`}>
        <Button onClick={fn()}>Click me</Button>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof ButtonShowcase> = {
  title: "Components/Button",
  component: ButtonShowcase,
};

export default meta;
type Story = StoryObj<typeof ButtonShowcase>;

export const Showcase: Story = {
  render: () => <ButtonShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Button")).toBeInTheDocument();

    // A contained button defaults to the shared primary accent.
    const containedButtons = canvas.getAllByRole("button", { name: "Contained" });
    await expect(containedButtons[0]).toHaveStyle({ backgroundColor: accent.primary });

    // Disabled buttons use native disabled semantics, not just styling.
    const textButtons = canvas.getAllByRole("button", { name: "Text" });
    await expect(textButtons[0]).toBeEnabled();
    await expect(textButtons[textButtons.length - 1]).toBeDisabled();

    // href renders a real link, focusable and navigable.
    const link = canvas.getByRole("link", { name: "Link button" });
    await expect(link).toHaveAttribute("href", "https://example.com");

    // Loading buttons are non-interactive and expose aria-busy.
    const loadingCenter = canvas.getByRole("button", { name: "Center" });
    await expect(loadingCenter).toBeDisabled();
    await expect(loadingCenter).toHaveAttribute("aria-busy", "true");

    // The click handler actually fires.
    await userEvent.click(canvas.getByRole("button", { name: "Click me" }));
  },
};
