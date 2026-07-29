import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Snackbar } from "./Snackbar";
import { Alert } from "../alert";
import { Button } from "../../components/button";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function BasicDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Show snackbar
      </Button>
      <Snackbar open={open} onClose={() => setOpen(false)} message="Changes saved." position="bottom-left" />
    </>
  );
}

function AutoHideDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Show (auto-hides in 800ms)
      </Button>
      <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={800} message="This dismisses itself." position="bottom-left" />
    </>
  );
}

function AlertDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Show with Alert
      </Button>
      <Snackbar open={open} onClose={() => setOpen(false)} position="bottom-left">
        <Alert severity="success" variant="filled" onClose={() => setOpen(false)}>
          Upload complete.
        </Alert>
      </Snackbar>
    </>
  );
}

function SnackbarShowcase() {
  return (
    <ShowcasePage title="Snackbar" description="A transient, non-modal notification — no backdrop, doesn't steal focus.">
      <ShowcaseCard label="basic" code={`<Snackbar open={open} onClose={() => setOpen(false)} message="Changes saved." />`}>
        <BasicDemo />
      </ShowcaseCard>

      <ShowcaseCard label="autoHideDuration" code={`<Snackbar open={open} autoHideDuration={4000} onClose={close} message="…" />`}>
        <AutoHideDemo />
      </ShowcaseCard>

      <ShowcaseCard
        label="with an Alert (children override message/action)"
        code={`<Snackbar open={open} onClose={close}>
  <Alert severity="success" variant="filled" onClose={close}>Upload complete.</Alert>
</Snackbar>`}
      >
        <AlertDemo />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof SnackbarShowcase> = {
  title: "Feedbacks/Snackbar",
  component: SnackbarShowcase,
};

export default meta;
type Story = StoryObj<typeof SnackbarShowcase>;

export const Showcase: Story = {
  render: () => <SnackbarShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await expect(canvas.getByText("Snackbar")).toBeInTheDocument();
    await expect(body.queryByRole("status")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Show snackbar" }));
    const snackbar = body.getByRole("status");
    await expect(snackbar).toHaveTextContent("Changes saved.");

    await userEvent.click(within(snackbar).getByRole("button", { name: "Close" }));
    await expect(body.queryByRole("status")).not.toBeInTheDocument();

    // autoHideDuration dismisses it without any click.
    await userEvent.click(canvas.getByRole("button", { name: "Show (auto-hides in 800ms)" }));
    await expect(body.getByRole("status")).toHaveTextContent("This dismisses itself.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await expect(body.queryByRole("status")).not.toBeInTheDocument();

    // children (an Alert) override the default message/action layout entirely.
    await userEvent.click(canvas.getByRole("button", { name: "Show with Alert" }));
    await expect(body.getByRole("alert")).toHaveTextContent("Upload complete.");
  },
};
