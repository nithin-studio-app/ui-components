import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Table, TableHead, TableBody, TableRow, TableCell } from "./Table";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

const rows = [
  { name: "Nova training run", status: "Success", size: "1.2 GB" },
  { name: "Portrait batch", status: "In progress", size: "480 MB" },
  { name: "Landscape set", status: "Queued", size: "2.4 GB" },
];

function TableShowcase() {
  return (
    <ShowcasePage title="Table" description="Semantic table markup, wrapped for horizontal scroll on overflow.">
      <ShowcaseCard label="basic">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Name</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header align="right">
                Size
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} hover>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell align="right">{row.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseCard>

      <ShowcaseCard label="alignment">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Left</TableCell>
              <TableCell header align="center">
                Center
              </TableCell>
              <TableCell header align="right">
                Right
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>a</TableCell>
              <TableCell align="center">b</TableCell>
              <TableCell align="right">c</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof TableShowcase> = {
  title: "DataDisplay/Table",
  component: TableShowcase,
};

export default meta;
type Story = StoryObj<typeof TableShowcase>;

export const Showcase: Story = {
  render: () => <TableShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Table")).toBeInTheDocument();

    const tables = canvas.getAllByRole("table");
    await expect(tables).toHaveLength(2);

    await expect(canvas.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    await expect(canvas.getByText("Nova training run")).toBeInTheDocument();

    // 1 header row + 3 data rows in the first table.
    await expect(within(tables[0]).getAllByRole("row")).toHaveLength(4);
  },
};
