import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
} from "./Table";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

const rows = [
  { name: "Nova training run", status: "Success", size: "1.2 GB" },
  { name: "Portrait batch", status: "In progress", size: "480 MB" },
  { name: "Landscape set", status: "Queued", size: "2.4 GB" },
];

const manyRows = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

type SortDirection = "asc" | "desc";

function SortableDemo() {
  const [direction, setDirection] = useState<SortDirection>("asc");
  const sorted = [...rows].sort((a, b) =>
    direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell header sortDirection={direction}>
            <TableSortLabel
              active
              direction={direction}
              onClick={() => setDirection(direction === "asc" ? "desc" : "asc")}
            >
              Name
            </TableSortLabel>
          </TableCell>
          <TableCell header>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map((row) => (
          <TableRow key={row.name}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const pageRows = manyRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell header>#</TableCell>
          <TableCell header>Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pageRows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} padding="none">
            <TablePagination
              count={manyRows.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={(next) => {
                setRowsPerPage(next);
                setPage(0);
              }}
            />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function SelectionDemo() {
  const [selected, setSelected] = useState<string[]>([rows[0].name]);

  function toggle(name: string) {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell header padding="checkbox">
            <span
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
                whiteSpace: "nowrap",
              }}
            >
              Select row
            </span>
          </TableCell>
          <TableCell header>Name</TableCell>
          <TableCell header>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name} selected={selected.includes(row.name)}>
            <TableCell padding="checkbox">
              <input
                type="checkbox"
                checked={selected.includes(row.name)}
                onChange={() => toggle(row.name)}
                aria-label={`Select ${row.name}`}
              />
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TableShowcase() {
  return (
    <ShowcasePage title="Table" description="Semantic table markup, wrapped for horizontal scroll on overflow.">
      <ShowcaseCard
        label="basic"
        code={`<Table>
  <TableHead>
    <TableRow>
      <TableCell header>Name</TableCell>
      <TableCell header>Status</TableCell>
      <TableCell header align="right">Size</TableCell>
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
</Table>`}
      >
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

      <ShowcaseCard
        label="alignment"
        code={`<Table>
  <TableHead>
    <TableRow>
      <TableCell header>Left</TableCell>
      <TableCell header align="center">Center</TableCell>
      <TableCell header align="right">Right</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>a</TableCell>
      <TableCell align="center">b</TableCell>
      <TableCell align="right">c</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
      >
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

      <ShowcaseCard label="size (dense)" code={`<Table size="small">…</Table>`}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell header>Name</TableCell>
              <TableCell header>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseCard>

      <ShowcaseCard label="stickyHeader" code={`<Table stickyHeader>…</Table>`}>
        <div
          role="region"
          aria-label="Scrollable item list"
          tabIndex={0}
          style={{ maxHeight: "8rem", overflowY: "auto" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell header>#</TableCell>
                <TableCell header>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {manyRows.slice(0, 8).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="caption" code={`<Table caption="A list of recent runs.">…</Table>`}>
        <Table caption="A list of recent runs.">
          <TableHead>
            <TableRow>
              <TableCell header>Name</TableCell>
              <TableCell header>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ShowcaseCard>

      <ShowcaseCard
        label="footer"
        code={`<TableFooter>
  <TableRow>
    <TableCell>Total</TableCell>
    <TableCell align="right">4.08 GB</TableCell>
  </TableRow>
</TableFooter>`}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Name</TableCell>
              <TableCell header align="right">
                Size
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell align="right">4.08 GB</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ShowcaseCard>

      <ShowcaseCard
        label="row selection (checkbox column)"
        code={`<TableCell padding="checkbox">
  <input type="checkbox" checked={selected} onChange={toggle} aria-label="Select row" />
</TableCell>`}
      >
        <SelectionDemo />
      </ShowcaseCard>

      <ShowcaseCard
        label="sortable header"
        code={`<TableCell header sortDirection={direction}>
  <TableSortLabel active direction={direction} onClick={toggleDirection}>
    Name
  </TableSortLabel>
</TableCell>`}
      >
        <SortableDemo />
      </ShowcaseCard>

      <ShowcaseCard
        label="pagination"
        code={`<TablePagination
  count={count}
  page={page}
  rowsPerPage={rowsPerPage}
  onPageChange={setPage}
  onRowsPerPageChange={setRowsPerPage}
/>`}
      >
        <PaginationDemo />
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
    // basic, alignment, dense, sticky, caption, footer, selection, sort, pagination
    await expect(tables).toHaveLength(9);

    await expect(within(tables[0]).getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    await expect(within(tables[0]).getByText("Nova training run")).toBeInTheDocument();

    // 1 header row + 3 data rows in the first table.
    await expect(within(tables[0]).getAllByRole("row")).toHaveLength(4);

    // Caption renders real <caption> text.
    await expect(canvas.getByText("A list of recent runs.")).toBeInTheDocument();

    // Footer renders as a real row, distinct from the body rows.
    await expect(canvas.getByText("Total")).toBeInTheDocument();
    await expect(canvas.getByText("4.08 GB")).toBeInTheDocument();

    // Row selection: pre-selected row is aria-selected, checkbox toggles it.
    const firstCheckbox = canvas.getByRole("checkbox", { name: "Select Nova training run" });
    await expect(firstCheckbox).toBeChecked();
    const selectedRow = firstCheckbox.closest("tr");
    await expect(selectedRow).toHaveAttribute("aria-selected", "true");
    await userEvent.click(firstCheckbox);
    await expect(selectedRow).toHaveAttribute("aria-selected", "false");

    // Sortable header: clicking flips aria-sort on the <th>.
    const sortButton = canvas.getByRole("button", { name: "Name" });
    const sortHeader = sortButton.closest("th");
    await expect(sortHeader).toHaveAttribute("aria-sort", "ascending");
    await userEvent.click(sortButton);
    await expect(sortHeader).toHaveAttribute("aria-sort", "descending");

    // Pagination: "1–5 of 23" initially, Previous disabled, Next enabled.
    await expect(canvas.getByText("1–5 of 23")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Previous page" })).toBeDisabled();
    const nextButton = canvas.getByRole("button", { name: "Next page" });
    await expect(nextButton).toBeEnabled();
    await userEvent.click(nextButton);
    await expect(canvas.getByText("6–10 of 23")).toBeInTheDocument();
  },
};
