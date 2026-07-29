import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Link } from "./Link";
import { Text } from "../../data-display/text";
import { palette } from "../../foundations/colors";
import { ShowcasePage, ShowcaseCard } from "../../_showcase";

function LinkShowcase() {
  return (
    <ShowcasePage title="Link" description="A real anchor, styled consistently — underline behavior, color, external-link safety.">
      <ShowcaseCard
        label="underline"
        code={`<Link href="#" underline="always">Always</Link>
<Link href="#" underline="hover">Hover</Link>
<Link href="#" underline="none">None</Link>`}
      >
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="#always" underline="always">
            Always
          </Link>
          <Link href="#hover" underline="hover">
            Hover
          </Link>
          <Link href="#none" underline="none">
            None
          </Link>
        </div>
      </ShowcaseCard>

      <ShowcaseCard label="color" code={`<Link href="#" color={palette.red[300]}>Danger link</Link>`}>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="#danger" color={palette.red[300]}>
            Danger link
          </Link>
          <Link href="#success" color={palette.lightGreen.A700}>
            Success link
          </Link>
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        label="external (target=_blank, safe rel by default)"
        code={`<Link href="https://example.com" target="_blank">Opens in a new tab</Link>`}
      >
        <Link href="https://example.com" target="_blank">
          Opens in a new tab
        </Link>
      </ShowcaseCard>

      <ShowcaseCard
        label="inline within text"
        code={`<Text>Read our <Link href="#">terms of service</Link> before continuing.</Text>`}
      >
        <Text>
          Read our <Link href="#terms">terms of service</Link> before continuing.
        </Text>
      </ShowcaseCard>

      <ShowcaseCard label="click handler" code={`<Link href="#" onClick={() => {}}>Click me</Link>`}>
        <Link href="#click" onClick={fn()}>
          Click me
        </Link>
      </ShowcaseCard>
    </ShowcasePage>
  );
}

const meta: Meta<typeof LinkShowcase> = {
  title: "Navigations/Link",
  component: LinkShowcase,
};

export default meta;
type Story = StoryObj<typeof LinkShowcase>;

export const Showcase: Story = {
  render: () => <LinkShowcase />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Link")).toBeInTheDocument();

    const external = canvas.getByRole("link", { name: "Opens in a new tab" });
    await expect(external).toHaveAttribute("target", "_blank");
    await expect(external).toHaveAttribute("rel", "noopener noreferrer");

    const inline = canvas.getByRole("link", { name: "terms of service" });
    await expect(inline).toHaveAttribute("href", "#terms");

    await expect(canvas.getByRole("link", { name: "Click me" })).toBeInTheDocument();
  },
};
