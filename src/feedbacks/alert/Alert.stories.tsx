import { useState } from "react";
import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Alert } from "./Alert";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function Column({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>{children}</div>;
}

function DismissibleDemo() {
  const [open, setOpen] = useState(true);
  if (!open) return <Alert severity="success">Dismissed — reload the story to see it again.</Alert>;
  return (
    <Alert severity="success" onClose={() => setOpen(false)}>
      Your changes have been saved.
    </Alert>
  );
}

function AlertShowcase() {
  return (
    <ShowcasePage title="Alert" description="A short, colored message calling out something the user should notice.">
      <ShowcaseCard
        label="severity"
        code={`<Alert severity="success">A success alert</Alert>
<Alert severity="info">An info alert</Alert>
<Alert severity="warning">A warning alert</Alert>
<Alert severity="error">An error alert</Alert>`}
      >
        <Column>
          <Alert severity="success">A success alert — check it out!</Alert>
          <Alert severity="info">An info alert — check it out!</Alert>
          <Alert severity="warning">A warning alert — check it out!</Alert>
          <Alert severity="error">An error alert — check it out!</Alert>
        </Column>
      </ShowcaseCard>

      <ShowcaseCard label="variant: outlined" code={`<Alert severity="error" variant="outlined">…</Alert>`}>
        <Column>
          <Alert severity="success" variant="outlined">
            A success alert — outlined
          </Alert>
          <Alert severity="error" variant="outlined">
            An error alert — outlined
          </Alert>
        </Column>
      </ShowcaseCard>

      <ShowcaseCard label="variant: filled" code={`<Alert severity="warning" variant="filled">…</Alert>`}>
        <Column>
          <Alert severity="warning" variant="filled">
            A warning alert — filled
          </Alert>
          <Alert severity="error" variant="filled">
            An error alert — filled
          </Alert>
        </Column>
      </ShowcaseCard>

      <ShowcaseCard
        label="title"
        code={`<Alert severity="error" title="Error">Something went wrong.</Alert>`}
      >
        <Alert severity="error" title="Error">
          This is an error alert — check it out!
        </Alert>
      </ShowcaseCard>

      <ShowcaseCard
        label="dismissible (onClose)"
        code={`<Alert severity="success" onClose={() => setOpen(false)}>Saved.</Alert>`}
      >
        <Column>
          {/* Static — never clicked by the play function below, so the
              close button stays visible for anyone just browsing the story
              (the interactive copy right after this one gets auto-dismissed
              by its own test as soon as the story mounts). */}
          <Alert severity="info" onClose={fn()}>
            Click the × to dismiss.
          </Alert>
          <DismissibleDemo />
        </Column>
      </ShowcaseCard>

      <ShowcaseCard
        label="custom action"
        code={`<Alert severity="warning" action={<button>Undo</button>}>…</Alert>`}
      >
        <Alert
          severity="warning"
          action={
            <button type="button" onClick={fn()} style={{ font: "inherit", color: "inherit", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
              UNDO
            </button>
          }
        >
          Item moved to trash.
        </Alert>
      </ShowcaseCard>

      <ShowcaseCard label="no icon" code={`<Alert severity="info" icon={false}>…</Alert>`}>
        <Alert severity="info" icon={false}>
          An info alert without an icon.
        </Alert>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof AlertShowcase> = {
  title: "Feedbacks/Alert",
  component: AlertShowcase,
};

export default meta;
type Story = StoryObj<typeof AlertShowcase>;

export const Showcase: Story = {
  render: () => <AlertShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Alert")).toBeInTheDocument();

    const alerts = canvas.getAllByRole("alert");
    await expect(alerts.length).toBeGreaterThan(5);

    await expect(canvas.getByText("This is an error alert — check it out!")).toBeInTheDocument();

    // The static example's close button stays untouched and visible.
    await expect(canvas.getByText("Click the × to dismiss.")).toBeInTheDocument();

    // Closing the interactive copy removes it and swaps in the dismissed message.
    const savedAlert = canvas.getByText("Your changes have been saved.").closest('[role="alert"]') as HTMLElement;
    await userEvent.click(within(savedAlert).getByRole("button", { name: "Close" }));
    await expect(canvas.getByText("Dismissed — reload the story to see it again.")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "UNDO" }));
  },
};
