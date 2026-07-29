import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { List, ListItem, ListItemText } from "./List";
import { PersonIcon, StarIcon, CloseIcon } from "../icons";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function ListShowcase() {
  return (
    <ShowcasePage title="List" description="Rows of content, optionally clickable, with leading/trailing slots.">
      <ShowcaseCard
        label="basic"
        code={`<List>
  <ListItem><ListItemText primary="Inbox" /></ListItem>
  <ListItem><ListItemText primary="Drafts" /></ListItem>
  <ListItem><ListItemText primary="Sent" /></ListItem>
</List>`}
      >
        <List>
          <ListItem>
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Drafts" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Sent" />
          </ListItem>
        </List>
      </ShowcaseCard>

      <ShowcaseCard
        label="dense"
        code={`<List dense>
  <ListItem><ListItemText primary="Inbox" /></ListItem>
  <ListItem><ListItemText primary="Drafts" /></ListItem>
</List>`}
      >
        <List dense>
          <ListItem>
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Drafts" />
          </ListItem>
        </List>
      </ShowcaseCard>

      <ShowcaseCard
        label="with icon + secondary text"
        code={`<List>
  <ListItem icon={<PersonIcon />}>
    <ListItemText primary="Jane Doe" secondary="jane@example.com" />
  </ListItem>
</List>`}
      >
        <List>
          <ListItem icon={<PersonIcon />}>
            <ListItemText primary="Jane Doe" secondary="jane@example.com" />
          </ListItem>
          <ListItem icon={<PersonIcon />}>
            <ListItemText primary="Priya Shah" secondary="priya@example.com" />
          </ListItem>
        </List>
      </ShowcaseCard>

      <ShowcaseCard
        label="clickable + selected"
        code={`<List>
  <ListItem onClick={() => {}} selected>
    <ListItemText primary="Selected item" />
  </ListItem>
  <ListItem onClick={() => {}}>
    <ListItemText primary="Another item" />
  </ListItem>
</List>`}
      >
        <List>
          <ListItem onClick={fn()} selected>
            <ListItemText primary="Selected item" />
          </ListItem>
          <ListItem onClick={fn()}>
            <ListItemText primary="Another item" />
          </ListItem>
        </List>
      </ShowcaseCard>

      <ShowcaseCard
        label="trailing action"
        code={`<List>
  <ListItem
    icon={<StarIcon />}
    action={
      <button aria-label="Remove" onClick={() => {}}>
        <CloseIcon />
      </button>
    }
  >
    <ListItemText primary="Starred item" />
  </ListItem>
</List>`}
      >
        <List>
          <ListItem
            icon={<StarIcon />}
            action={
              <button type="button" onClick={fn()} aria-label="Remove" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
                <span style={{ display: "block", width: "1rem", height: "1rem" }}>
                  <CloseIcon />
                </span>
              </button>
            }
          >
            <ListItemText primary="Starred item" />
          </ListItem>
        </List>
      </ShowcaseCard>

      <ShowcaseCard
        label="disabled"
        code={`<List>
  <ListItem onClick={() => {}} disabled>
    <ListItemText primary="Disabled item" />
  </ListItem>
</List>`}
      >
        <List>
          <ListItem onClick={fn()} disabled>
            <ListItemText primary="Disabled item" />
          </ListItem>
        </List>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof ListShowcase> = {
  title: "DataDisplay/List",
  component: ListShowcase,
};

export default meta;
type Story = StoryObj<typeof ListShowcase>;

export const Showcase: Story = {
  render: () => <ListShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("List")).toBeInTheDocument();
    await expect(canvas.getAllByText("Inbox").length).toBeGreaterThan(0);
    await expect(canvas.getByText("jane@example.com")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Another item" }));

    // disabled=true drops button semantics, same as Chip.
    await expect(canvas.queryByRole("button", { name: "Disabled item" })).not.toBeInTheDocument();

    await expect(canvas.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  },
};
