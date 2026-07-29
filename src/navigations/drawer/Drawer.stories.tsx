import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Drawer } from "./Drawer";
import type { DrawerAnchor } from "./Drawer";
import { Button } from "../../components/button";
import { List, ListItem, ListItemText } from "../../data-display/list";
import { HomeIcon, SettingsIcon, LogoutIcon } from "../../data-display/icons";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function DrawerNav() {
  return (
    <List>
      <ListItem icon={<HomeIcon />} onClick={fn()}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem icon={<SettingsIcon />} onClick={fn()}>
        <ListItemText primary="Settings" />
      </ListItem>
      <ListItem icon={<LogoutIcon />} onClick={fn()}>
        <ListItemText primary="Log out" />
      </ListItem>
    </List>
  );
}

function TemporaryDemo({ anchor }: { anchor: DrawerAnchor }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open {anchor} drawer
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} anchor={anchor} aria-label={`${anchor} navigation`}>
        <DrawerNav />
      </Drawer>
    </>
  );
}

function DrawerShowcase() {
  return (
    <ShowcasePage title="Drawer" description="A panel sliding in from an edge of the screen, or docked as part of the layout.">
      <ShowcaseCard
        label="temporary (left, default)"
        code={`<Drawer open={open} onClose={() => setOpen(false)}>
  <List>…</List>
</Drawer>`}
      >
        <TemporaryDemo anchor="left" />
      </ShowcaseCard>

      <ShowcaseCard label="anchor: right" code={`<Drawer anchor="right" open={open} onClose={close}>…</Drawer>`}>
        <TemporaryDemo anchor="right" />
      </ShowcaseCard>

      <ShowcaseCard label="anchor: top" code={`<Drawer anchor="top" open={open} onClose={close}>…</Drawer>`}>
        <TemporaryDemo anchor="top" />
      </ShowcaseCard>

      <ShowcaseCard label="anchor: bottom" code={`<Drawer anchor="bottom" open={open} onClose={close}>…</Drawer>`}>
        <TemporaryDemo anchor="bottom" />
      </ShowcaseCard>

      <ShowcaseCard
        label="persistent (docked inline, dismissible)"
        code={`<div style={{ display: "flex" }}>
  <Drawer variant="persistent" open={open}>…</Drawer>
  <main>Content</main>
</div>`}
      >
        <div style={{ display: "flex", height: "12rem", border: "1px solid #2a2c30", borderRadius: "8px", overflow: "hidden" }}>
          <Drawer variant="persistent" open aria-label="Persistent navigation">
            <DrawerNav />
          </Drawer>
          <div style={{ flex: 1, padding: "1rem", color: "#9aa0a6" }}>Page content sits alongside it.</div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        label="permanent (always docked)"
        code={`<div style={{ display: "flex" }}>
  <Drawer variant="permanent">…</Drawer>
  <main>Content</main>
</div>`}
      >
        <div style={{ display: "flex", height: "12rem", border: "1px solid #2a2c30", borderRadius: "8px", overflow: "hidden" }}>
          <Drawer variant="permanent" open aria-label="Permanent navigation">
            <DrawerNav />
          </Drawer>
          <div style={{ flex: 1, padding: "1rem", color: "#9aa0a6" }}>Page content sits alongside it.</div>
        </div>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof DrawerShowcase> = {
  title: "Navigations/Drawer",
  component: DrawerShowcase,
};

export default meta;
type Story = StoryObj<typeof DrawerShowcase>;

export const Showcase: Story = {
  render: () => <DrawerShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await expect(canvas.getByText("Drawer")).toBeInTheDocument();

    // Persistent/permanent drawers render inline, no portal needed.
    await expect(canvas.getAllByText("Home").length).toBeGreaterThan(0);

    // Temporary drawer portals to document.body, traps focus, and closes on Escape.
    const trigger = canvas.getByRole("button", { name: "Open left drawer" });
    await userEvent.click(trigger);

    const drawer = body.getByRole("dialog", { name: "left navigation" });
    await expect(drawer).toBeInTheDocument();
    await expect(within(drawer).getByRole("button", { name: "Home" })).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await expect(body.queryByRole("dialog", { name: "left navigation" })).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
};
