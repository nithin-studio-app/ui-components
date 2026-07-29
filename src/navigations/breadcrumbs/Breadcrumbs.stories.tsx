import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Breadcrumbs } from "./Breadcrumbs";
import { Link } from "../link";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function BreadcrumbsShowcase() {
  return (
    <ShowcasePage title="Breadcrumbs" description="Shows the current page's position in a hierarchy, as a trail of links.">
      <ShowcaseCard
        label="basic"
        code={`<Breadcrumbs>
  <Link href="/">Home</Link>
  <Link href="/library">Library</Link>
  <span>Data</span>
</Breadcrumbs>`}
      >
        <Breadcrumbs aria-label="Basic example">
          <Link href="#home" underline="hover">
            Home
          </Link>
          <Link href="#library" underline="hover">
            Library
          </Link>
          <span>Data</span>
        </Breadcrumbs>
      </ShowcaseCard>

      <ShowcaseCard label="custom separator" code={`<Breadcrumbs separator="›">…</Breadcrumbs>`}>
        <Breadcrumbs separator="›" aria-label="Custom separator example">
          <Link href="#home" underline="hover">
            Home
          </Link>
          <Link href="#library" underline="hover">
            Library
          </Link>
          <span>Data</span>
        </Breadcrumbs>
      </ShowcaseCard>

      <ShowcaseCard
        label="collapsed (maxItems)"
        code={`<Breadcrumbs maxItems={3}>
  <Link href="/">Home</Link>
  <Link href="/a">Category</Link>
  <Link href="/a/b">Subcategory</Link>
  <Link href="/a/b/c">Collection</Link>
  <span>Item</span>
</Breadcrumbs>`}
      >
        <Breadcrumbs maxItems={3} aria-label="Collapsed example">
          <Link href="#home" underline="hover">
            Home
          </Link>
          <Link href="#category" underline="hover">
            Category
          </Link>
          <Link href="#subcategory" underline="hover">
            Subcategory
          </Link>
          <Link href="#collection" underline="hover">
            Collection
          </Link>
          <span>Item</span>
        </Breadcrumbs>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof BreadcrumbsShowcase> = {
  title: "Navigations/Breadcrumbs",
  component: BreadcrumbsShowcase,
};

export default meta;
type Story = StoryObj<typeof BreadcrumbsShowcase>;

export const Showcase: Story = {
  render: () => <BreadcrumbsShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Breadcrumbs")).toBeInTheDocument();

    // The last crumb is marked as the current page.
    const dataItems = canvas.getAllByText("Data");
    await expect(dataItems[0].closest("li")).toHaveAttribute("aria-current", "page");

    // Collapsed breadcrumbs hide the middle items behind an expandable ellipsis.
    const collapsedNav = canvas.getByRole("navigation", { name: "Collapsed example" });
    await expect(within(collapsedNav).queryByText("Category")).not.toBeInTheDocument();
    await expect(within(collapsedNav).getByText("Home")).toBeInTheDocument();
    await expect(within(collapsedNav).getByText("Item")).toBeInTheDocument();

    await userEvent.click(within(collapsedNav).getByRole("button", { name: "Show all breadcrumbs" }));
    await expect(within(collapsedNav).getByText("Category")).toBeInTheDocument();
  },
};
