import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Dialog } from "./Dialog";
import { Button } from "../../components/button";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function BasicDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete file?"
        actions={
          <>
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        This action can't be undone. The file will be permanently removed.
      </Dialog>
    </>
  );
}

function MaxWidthDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open large dialog
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Large dialog" maxWidth="lg" fullWidth>
        This dialog uses maxWidth="lg" and fullWidth, so it grows to fill most of the viewport width.
      </Dialog>
    </>
  );
}

function DialogShowcase() {
  return (
    <ShowcasePage title="Dialog" description="A modal panel that interrupts the page until dismissed.">
      <ShowcaseCard
        label="basic (title + actions)"
        code={`<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete file?"
  actions={<><Button onClick={close}>Cancel</Button><Button onClick={confirm}>Delete</Button></>}
>
  This action can't be undone.
</Dialog>`}
      >
        <BasicDemo />
      </ShowcaseCard>

      <ShowcaseCard label="maxWidth + fullWidth" code={`<Dialog maxWidth="lg" fullWidth open={open}>…</Dialog>`}>
        <MaxWidthDemo />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof DialogShowcase> = {
  title: "Feedbacks/Dialog",
  component: DialogShowcase,
};

export default meta;
type Story = StoryObj<typeof DialogShowcase>;

export const Showcase: Story = {
  render: () => <DialogShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await expect(canvas.getByText("Dialog")).toBeInTheDocument();

    // Dialog portals to document.body, so it's not found in the story canvas until opened.
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument();

    const trigger = canvas.getByRole("button", { name: "Open dialog" });
    await userEvent.click(trigger);

    const dialog = body.getByRole("dialog", { name: "Delete file?" });
    await expect(dialog).toBeInTheDocument();

    // Focus moves into the dialog on open (onto its first focusable element).
    await expect(body.getByRole("button", { name: "Cancel" })).toHaveFocus();

    // Escape closes it and returns focus to the trigger.
    await userEvent.keyboard("{Escape}");
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();

    // Clicking the backdrop also closes it.
    await userEvent.click(trigger);
    await expect(body.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(body.getByRole("dialog").parentElement!);
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument();
  },
};
