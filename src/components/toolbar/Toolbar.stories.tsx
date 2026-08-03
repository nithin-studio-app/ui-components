import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";
import { Toolbar } from "./Toolbar";
import { Button } from "../button";
import { GridViewIcon, SearchIcon, TableViewIcon, UploadIcon } from "../../data-display/icons";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function IconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} style={{ display: "flex", background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
      {children}
    </button>
  );
}

function ToolbarShowcase() {
  return (
    <ShowcasePage
      title="Toolbar"
      description="A bordered container grouping a cluster of related actions — unopinionated about what's inside."
    >
      <ShowcaseCard
        label="mixed controls"
        code={`<Toolbar aria-label="File actions">
  <IconButton aria-label="Search"><SearchIcon /></IconButton>
  <IconButton aria-label="List view"><TableViewIcon /></IconButton>
  <IconButton aria-label="Grid view"><GridViewIcon /></IconButton>
  <Button variant="outlined" size="small">New folder</Button>
  <Button variant="contained" size="small" startIcon={<UploadIcon />}>Upload</Button>
</Toolbar>`}
      >
        <Toolbar aria-label="File actions">
          <IconButton label="Search">
            <SearchIcon />
          </IconButton>
          <IconButton label="List view">
            <TableViewIcon />
          </IconButton>
          <IconButton label="Grid view">
            <GridViewIcon />
          </IconButton>
          <Button variant="outlined" size="small">
            New folder
          </Button>
          <Button variant="contained" size="small" startIcon={<UploadIcon />}>
            Upload
          </Button>
        </Toolbar>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof ToolbarShowcase> = {
  title: "Components/Toolbar",
  component: ToolbarShowcase,
};

export default meta;
type Story = StoryObj<typeof ToolbarShowcase>;

export const Showcase: Story = {
  render: () => <ToolbarShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("toolbar", { name: "File actions" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  },
};
