import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Pagination } from "./Pagination";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function ControlledDemo() {
  const [page, setPage] = useState(5);
  return <Pagination count={10} page={page} onChange={setPage} aria-label="Controlled example" />;
}

function PaginationShowcase() {
  return (
    <ShowcasePage title="Pagination" description="Page navigation, collapsing the middle behind an ellipsis once there are too many to show.">
      <ShowcaseCard label="basic" code={`<Pagination count={10} page={5} onChange={setPage} />`}>
        <ControlledDemo />
      </ShowcaseCard>

      <ShowcaseCard label="near the start" code={`<Pagination count={20} page={1} onChange={setPage} />`}>
        <Pagination count={20} page={1} onChange={() => {}} aria-label="Near-start example" />
      </ShowcaseCard>

      <ShowcaseCard label="near the end" code={`<Pagination count={20} page={20} onChange={setPage} />`}>
        <Pagination count={20} page={20} onChange={() => {}} aria-label="Near-end example" />
      </ShowcaseCard>

      <ShowcaseCard label="few pages (no collapsing)" code={`<Pagination count={5} page={2} onChange={setPage} />`}>
        <Pagination count={5} page={2} onChange={() => {}} aria-label="Few-pages example" />
      </ShowcaseCard>

      <ShowcaseCard label="size" code={`<Pagination size="small" count={10} page={3} onChange={setPage} />`}>
        <Pagination size="small" count={10} page={3} onChange={() => {}} aria-label="Small example" />
      </ShowcaseCard>

      <ShowcaseCard label="disabled" code={`<Pagination disabled count={10} page={3} onChange={setPage} />`}>
        <Pagination disabled count={10} page={3} onChange={() => {}} aria-label="Disabled example" />
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof PaginationShowcase> = {
  title: "Navigations/Pagination",
  component: PaginationShowcase,
};

export default meta;
type Story = StoryObj<typeof PaginationShowcase>;

export const Showcase: Story = {
  render: () => <PaginationShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Pagination")).toBeInTheDocument();

    const basic = canvas.getByRole("navigation", { name: "Controlled example" });
    await expect(within(basic).getByRole("button", { name: "Page 5, current page" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    // Advancing updates the current-page indicator.
    await userEvent.click(within(basic).getByRole("button", { name: "Go to page 6" }));
    await expect(within(basic).getByRole("button", { name: "Page 6, current page" })).toBeInTheDocument();

    // At the first page, Previous is disabled; at the last, Next is.
    const nearStart = canvas.getByRole("navigation", { name: "Near-start example" });
    await expect(within(nearStart).getByRole("button", { name: "Previous page" })).toBeDisabled();
    const nearEnd = canvas.getByRole("navigation", { name: "Near-end example" });
    await expect(within(nearEnd).getByRole("button", { name: "Next page" })).toBeDisabled();

    // Few pages show every page number, no collapsing.
    const fewPages = canvas.getByRole("navigation", { name: "Few-pages example" });
    await expect(within(fewPages).getByRole("button", { name: "Go to page 5" })).toBeInTheDocument();

    const disabled = canvas.getByRole("navigation", { name: "Disabled example" });
    await expect(within(disabled).getByRole("button", { name: "Go to page 1" })).toBeDisabled();
  },
};
